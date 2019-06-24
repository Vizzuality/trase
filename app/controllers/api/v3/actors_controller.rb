module Api
  module V3
    class ActorsController < ApiController
      before_action :load_node
      before_action :set_year

      def basic_attributes
        ensure_required_param_present(:year)

        @result = Api::V3::Actors::BasicAttributes.new(
          @context, @node, @year
        ).call

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

      def load_node
        ensure_required_param_present(:actor_id)
        @node = Api::V3::Node.actor_nodes(@context).find(params[:actor_id])
      end
    end
  end
end
