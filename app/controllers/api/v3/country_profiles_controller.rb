module Api
  module V3
    class CountryProfilesController < ApiController
      include Api::V3::Profiles::CrossContextHelpers

      skip_before_action :load_context
      before_action :ensure_commodity_or_context_given, only: [:top_consumer_actors, :top_consumer_countries]
      before_action :load_node
      before_action :set_year

      def basic_attributes
        @result = Api::V3::CountryProfiles::BasicAttributes.new(
          @node, @year
        ).call

        render json: {data: @result}
      end

      def commodity_exports
        @result = Api::V3::CountryProfiles::CommodityExports.new(
          @node, @year
        ).call

        render json: {data: @result}
      end

      def commodity_imports
        @result = Api::V3::CountryProfiles::CommodityImports.new(
          @node, @year
        ).call

        render json: {data: @result}
      end

      def top_consumer_actors
        if NodeTypeName.destination_country_names.include? @node.node_type
          @contexts = Api::V3::Context.where(commodity_id: @node.commodity_id)
        end
        @result = Api::V3::Profiles::CrossContextTopNodesChart.new(
          @contexts,
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_top_consumer_actors,
            include_other: true
          }
        ).call

        render json: {data: @result}
      end

      def top_consumer_countries
        @result =
          if @node.node_type == NodeTypeName::COUNTRY_OF_PRODUCTION
            Api::V3::Profiles::CrossContextTopNodesChart.new(
              @contexts,
              @node,
              @year,
              {
                profile_type: profile_type,
                chart_identifier: :country_top_consumer_countries,
                include_other: false
              }
            ).call
          else
            # because it is a cross-context chart, and because the node
            # may exist as multiple node types across contexts,
            # this chart will need to consider all matching nodes and contexts for commodity
            Api::V3::CountryProfiles::TopSourceCountriesChart.new(
              @node.commodity_id,
              @node.geo_id,
              @year,
              {}
            ).call
          end

        render json: {data: @result}
      end

      def indicators
        @result = Api::V3::Profiles::IndicatorsTable.new(
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_indicators
          }
        ).call

        render json: {data: @result}
      end

      def trajectory_deforestation
        @result = Api::V3::CountryProfiles::DeforestationTrajectory.new(
          @node, @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_trajectory_deforestation
          }
        ).call

        render json: {data: @result}
      end

      def trajectory_import
        @result = Api::V3::CountryProfiles::ImportTrajectory.new(
          @node, @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_trajectory_import
          }
        ).call

        render json: {data: @result}
      end

      private

      def profile_type
        Api::V3::Profile::COUNTRY
      end
    end
  end
end
