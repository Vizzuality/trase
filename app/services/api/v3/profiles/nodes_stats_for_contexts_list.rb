module Api
  module V3
    module Profiles
      class NodesStatsForContextsList < NodesStatsList
        def initialize(contexts_ids, data)
          super(data)

          @contexts_ids = contexts_ids
        end

        private

        def query_all_years(quants_ids, options = {})
          super(quants_ids, options).
            where(context_id: @contexts_ids)
        end
      end
    end
  end
end
