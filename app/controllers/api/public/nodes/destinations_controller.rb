module Api
  module Public
    module Nodes
      class DestinationsController < ApiController
        include Nodes

        skip_before_action :load_context

        private

        def filter_klass
          Destinations::Filter
        end
      end
    end
  end
end
