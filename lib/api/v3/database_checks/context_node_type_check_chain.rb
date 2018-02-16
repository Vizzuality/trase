# Prepares checks to be run on context_node_type objects

# The following checks are included:
#   DONE check +context_node_type_property+ present
module Api
  module V3
    module DatabaseChecks
      class ContextNodeTypeCheckChain < CheckChain
        validates :has_one_association_present,
                  association: :context_node_type_property,
                  link: {method: :admin_context_node_type_properties_path}
      end
    end
  end
end
