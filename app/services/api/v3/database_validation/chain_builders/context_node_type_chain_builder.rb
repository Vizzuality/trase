# Prepares checks to be run on context_node_type objects

# The following checks are included:
#   check +context_node_type_property+ present
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ContextNodeTypeChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :context_node_type_property,
                 link: :index
          checks :active_record_check,
                 on: :context_node_type_property,
                 link: :edit

          def self.build_chain(context)
            chain = []
            context.context_node_types.each do |context_node_type|
              chain += new(
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
