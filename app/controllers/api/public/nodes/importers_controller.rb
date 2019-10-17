module Api
  module Public
    module Nodes
      class ImportersController < ApiController
        include Nodes

        private

        def filter_klass
          Importers::Filter
        end
      end
    end
  end
end
