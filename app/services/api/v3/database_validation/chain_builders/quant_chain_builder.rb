# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +quant_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class QuantChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :quant_property,
                 link: {method: :admin_quant_properties_path}
          # checks :attribute_present,
          #        attribute: :tooltip_text,
          #        link: {
          #          method: :admin_quant_property_path,
          #          params: [:quant_property]
          #        },
          #        severity: :warn
        end
      end
    end
  end
end
