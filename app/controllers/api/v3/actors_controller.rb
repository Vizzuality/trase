module Api
  module V3
    class ActorsController < ApiController
      include Api::V3::ProfileHelpers

      before_action :load_node
      before_action :set_year

      def basic_attributes
        @result = Api::V3::Readonly::NodeWithFlows.where(
          id: @node.id, context: @context.id
        ).pluck(:actor_basic_attributes).first[@year]

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
          where(context_id: @context.id, profile: 'actor').
          find(params[:actor_id])
      end
    end
  end
end
