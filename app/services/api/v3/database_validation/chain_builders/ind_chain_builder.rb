# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +ind_property+ present
#   check tooltip text present (WARN)
#   DONE if temporal set check year present, if not set check year absent
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
          checks :declared_temporal_matches_data,
                 association: :node_inds,
                 attribute: :is_temporal_on_actor_profile,
                 on: :ind_property,
                 link: {
                   method: :admin_ind_property_path,
                   params: [:ind_property]
                 }
          checks :declared_temporal_matches_data,
                 association: :node_inds,
                 attribute: :is_temporal_on_place_profile,
                 on: :ind_property,
                 link: {
                   method: :admin_ind_property_path,
                   params: [:ind_property]
                 }
        end
      end
    end
  end
end
