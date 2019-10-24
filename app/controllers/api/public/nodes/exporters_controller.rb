module Api
  module Public
    module Nodes
      class ExportersController < ApiController
        include Nodes

        private

        def filter_klass
          Exporters::Filter
        end
      end
    end
  end
end
