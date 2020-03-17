module Api
  module V3
    class PlacesController < ApiController
      include Api::V3::ProfileHelpers

      before_action :load_node
      before_action :set_year

      def basic_attributes
        @result = Api::V3::Places::BasicAttributes.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def top_consumer_actors
        @result = Api::V3::Places::TopConsumerActors.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      def top_consumer_countries
        @result = Api::V3::Places::TopConsumerCountries.new(
          @context, @node, @year
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

      def load_readonly_node
        ensure_required_param_present(:place_id)
        @readonly_node = Api::V3::Readonly::NodeWithFlows.
          without_unknowns.
          without_domestic.
          where(context_id: @context.id, profile: Api::V3::Profile::PLACE).
          find(params[:place_id])
      end
    end
  end
end
