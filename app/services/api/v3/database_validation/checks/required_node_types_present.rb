# Checks the presence of required node types in context.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class RequiredNodeTypesPresent < AbstractCheck
          # node types that need to exist in every context
          REQUIRED_NODE_TYPES = (NodeTypeName::destination_country_names + [NodeTypeName::EXPORTER]).freeze

          # @return (see AbstractCheck#passing?)
          def passing?
            node_types = @object.context_node_types.includes(:node_type).
              map { |cnt| cnt.node_type&.name }

            @missing_node_types = []
            @missing_node_types << NodeTypeName::EXPORTER unless node_types.include?(NodeTypeName::EXPORTER)
            if (NodeTypeName.destination_country_names & node_types).empty?
              @missing_node_types += NodeTypeName.destination_country_names
            end
            @missing_node_types.empty?
          end

          def self.human_readable(_options)
            required_node_types = REQUIRED_NODE_TYPES.join(', ')
            "presence of required node types or variants (#{required_node_types})"
          end

          private

          def error
            super.merge(
              message: "Required node type(s) or variants missing: #{@missing_node_types.join(', ')}. Make sure node type(s) with this/these name(s) exist."
            )
          end
        end
      end
    end
  end
end
