module Api
  module V3
    module Dashboards
      module Collection
        extend ActiveSupport::Concern

        def initialize_collection_for_index
          @collection = filter_klass.new(filter_params).
            call
        end

        def initialize_collection_for_search
          @collection = filter_klass.new(filter_params).
            call_with_query_term(params[:q])
        end
      end
    end
  end
end
