# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +ind_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class IndChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :ind_property,
                 link: {method: :admin_ind_properties_path}
          # checks :attribute_present,
          #        attribute: :tooltip_text,
          #        link: {
          #          method: :admin_ind_property_path,
          #          params: [:ind_property]
          #        },
          #        severity: :warn
        end
      end
    end
  end
end
