module Api
  module V3
    module Profiles
      class TopDestinationsForContextsList < TopDestinationsList
        def initialize(contexts_ids, data)
          super(data)

          @contexts_ids = contexts_ids
        end

        private

        def query_all_years(attribute, options = {})
          super(attribute, options).
            where(context_id: @contexts_ids)
        end
      end
    end
  end
end
