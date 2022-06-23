module Api
  module V3
    module NodesSearch
      class Filter
        def initialize
          @rel = Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            all
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
          if profile_only
            @rel = @rel.where.not(profile: nil)
          end
          @rel.
            search_by_name(query).
            select(select_columns).
            group(select_columns).
            limit(1000)
        end
      end
    end
  end
end
