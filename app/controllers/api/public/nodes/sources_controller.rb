module Api
  module Public
    module Nodes
      class SourcesController < ApiController
        include Nodes

        skip_before_action :load_context

        private

        def filter_klass
          Sources::Filter
        end
      end
    end
  end
end
