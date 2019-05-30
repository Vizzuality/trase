module Api
  module V3
    module Nodes
      class Filter
        # @param context [Api::V3::Context]
        def initialize(context)
          @context = context
          @query = initialize_query
        end

        def call
          @query.all
        end

        private

        def initialize_query
          Api::V3::Readonly::SankeyNode.
            select([
              :id,
              :main_id,
              :name,
              :geo_id,
              :is_domestic_consumption,
              :is_unknown,
              :node_type_id,
              :node_type,
              :profile_type,
              :has_flows,
              :is_aggregated
            ]).
            where(context_id: @context.id).
            where('has_flows OR source_country_iso2 = ?', @context.country.iso2)
        end
      end
    end
  end
end
