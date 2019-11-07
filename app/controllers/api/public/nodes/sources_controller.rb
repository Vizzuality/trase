module Api
  module Public
    module Nodes
      class SourcesController < ApiController
        include Nodes

        private

        def filter_klass
          Sources::Filter
        end
      end
    end
  end
end
