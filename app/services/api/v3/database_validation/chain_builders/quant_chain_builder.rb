# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +quant_property+ present
#   check tooltip text present (WARN)
#   DONE if temporal set check year present, if not set check year absent
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
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_actor_profile,
                 on: :quant_property,
                 link: {
                   method: :admin_quant_property_path,
                   params: [:quant_property]
                 }
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_place_profile,
                 on: :quant_property,
                 link: {
                   method: :admin_quant_property_path,
                   params: [:quant_property]
                 }
        end
      end
    end
  end
end
