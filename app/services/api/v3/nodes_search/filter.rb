module Api
  module V3
    module NodesSearch
      class Filter
        def initialize
          @rel = Api::V3::Readonly::Node.all
        end

        def call(query, context_id = nil, profile_only = nil)
          @rel = @rel.search_by_name(query).limit(100)
          @rel = @rel.where('context_id' => context_id) if context_id
          @rel = @rel.where('profile IS NOT NULL') if profile_only

          @rel
        end
      end
    end
  end
end
