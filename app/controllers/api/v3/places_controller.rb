module Api
  module V3
    class PlacesController < ApiController
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

      def load_node
        ensure_required_param_present(:place_id)
        @node = Api::V3::Node.place_nodes.find(params[:place_id])
      end
    end
  end
end
