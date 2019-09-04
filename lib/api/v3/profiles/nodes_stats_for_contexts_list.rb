module Api
  module V3
    module Profiles
      class NodesStatsForContextsList < NodesStatsList
        def initialize(contexts_ids, data)
          super(data)

          @contexts_ids = contexts_ids
        end

        private

        def query_all_years(attributes_ids, options = {})
          super(attributes_ids, options).
            where(context_id: @contexts_ids)
        end
      end
    end
  end
end
