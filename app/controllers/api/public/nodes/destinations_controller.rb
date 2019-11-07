module Api
  module Public
    module Nodes
      class DestinationsController < ApiController
        include Nodes

        private

        def filter_klass
          Destinations::Filter
        end
      end
    end
  end
end
