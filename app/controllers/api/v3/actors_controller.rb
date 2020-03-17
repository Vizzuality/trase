module Api
  module V3
    class ActorsController < ApiController
      include Api::V3::ProfileHelpers

      before_action :load_node
      before_action :set_year

      def basic_attributes
        basic_attributes = @readonly_node.actor_basic_attributes
        @result = basic_attributes && basic_attributes[@year.to_s]

        if @result.nil?
          # this can mean either data is not precomputed (non-default year)
          # or data is not available (data or configuration missing)
          # in both cases deferring to original implementation
          @result = Api::V3::Actors::BasicAttributes.new(
            @context, @node, @year
          ).call
        end

        render json: {data: @result}
      end

      def top_countries
        @result = Api::V3::Actors::TopCountries.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def top_sources
        @result = Api::V3::Actors::TopSources.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def sustainability
        @result = Api::V3::Actors::SustainabilityTable.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def exporting_companies
        @result = Api::V3::Actors::ExportingCompaniesPlot.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      private

      def load_readonly_node
        ensure_required_param_present(:actor_id)
        @readonly_node = Api::V3::Readonly::NodeWithFlows.
          where(context_id: @context.id, profile: Api::V3::Profile::ACTOR).
          find(params[:actor_id])
      end
    end
  end
end
