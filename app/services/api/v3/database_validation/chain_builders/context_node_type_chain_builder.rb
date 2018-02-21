# Prepares checks to be run on context_node_type objects

# The following checks are included:
#   DONE check +context_node_type_property+ present
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ContextNodeTypeChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :context_node_type_property,
                 link: {method: :admin_context_node_type_properties_path}

          def self.build_chain(context)
            chain = []
            context.context_node_types.each do |context_node_type|
              chain += self.new(
                context_node_type, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
