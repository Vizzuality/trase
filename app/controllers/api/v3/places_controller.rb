module Api
  module V3
    class PlacesController < ApiController
      include Api::V3::Profiles::SingleContextHelpers

      before_action :load_node
      before_action :set_year

      def basic_attributes
        @result = Api::V3::Places::BasicAttributes.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def top_consumer_actors
        @result = Api::V3::Profiles::SingleContextTopNodesChart.new(
          @context,
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :place_top_consumer_actors
          }
        ).call

        render json: {data: @result}
      end

      def top_consumer_countries
        @result = Api::V3::Profiles::SingleContextTopNodesChart.new(
          @context,
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :place_top_consumer_countries
          }
        ).call

        render json: {data: @result}
      end

      def indicators
        @result = Api::V3::Places::IndicatorsTable.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def trajectory_deforestation
        @result = Api::V3::Places::TrajectoryDeforestationPlot.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      private

      def profile_type
        Api::V3::Profile::PLACE
      end
    end
  end
end
