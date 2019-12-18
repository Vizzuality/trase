module Api
  module Public
    module Nodes
      class ExportersController < ApiController
        include PaginationHeaders
        include PaginatedCollection
        include Nodes

        skip_before_action :load_context

        private

        def filter_klass
          Exporters::Filter
        end
      end
    end
  end
end
