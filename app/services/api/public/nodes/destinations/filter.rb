module Api
  module Public
    module Nodes
      module Destinations
        class Filter < Api::Public::Nodes::Filter
          private

          def initialize_query
            @query = Api::V3::Readonly::NodeWithFlows.where(
              role: Api::V3::ContextNodeTypeProperty::DESTINATION_ROLE
            )
          end
        end
      end
    end
  end
end
