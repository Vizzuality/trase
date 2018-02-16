# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +qual_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class QualChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :qual_property,
                 link: {method: :admin_qual_properties_path}
          # checks :attribute_present,
          #        attribute: :tooltip_text,
          #        link: {
          #          method: :admin_qual_property_path,
          #          params: [:qual_property]
          #        },
          #        severity: :warn
        end
      end
    end
  end
end
