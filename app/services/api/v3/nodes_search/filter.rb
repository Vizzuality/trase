module Api
  module V3
    module NodesSearch
      class Filter
        def initialize
          @rel = Api::V3::Readonly::NodeWithFlows.all
        end

        def call(query, context_id = nil, profile_only = nil)
          select_columns = [
            :id,
            :main_id,
            :name,
            :node_type,
            :context_id,
            :profile,
            :is_subnational,
            :years,
            :rank
          ]
          @rel = @rel.where('context_id' => context_id) if context_id
          @rel = @rel.where('profile IS NOT NULL') if profile_only
          @rel.
            search_by_name(query).
            select(select_columns).
            group(select_columns).
            limit(100)
        end
      end
    end
  end
end
