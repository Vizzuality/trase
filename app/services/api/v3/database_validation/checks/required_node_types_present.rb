# Checks the presence of required node types in context.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class RequiredNodeTypesPresent < AbstractCheck
          # node types that need to exist in every context
          REQUIRED_NODE_TYPES = [
            NodeTypeName::COUNTRY, NodeTypeName::EXPORTER
          ].freeze

          # @return (see AbstractCheck#passing?)
          def passing?
            node_types = @object.context_node_types.includes(:node_type).
              map { |cnt| cnt.node_type&.name }
            @missing_node_types = REQUIRED_NODE_TYPES - node_types
            @missing_node_types.empty?
          end

          private

          def error
            super.merge(
              message: "Required node type(s) missing: #{@missing_node_types.join(', ')}. Make sure node type(s) with this/these name(s) exist."
            )
          end
        end
      end
    end
  end
end
