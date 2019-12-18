module Api
  module Public
    module Nodes
      class ImportersController < ApiController
        include PaginationHeaders
        include PaginatedCollection
        include Nodes

        skip_before_action :load_context

        private

        def filter_klass
          Importers::Filter
        end
      end
    end
  end
end
