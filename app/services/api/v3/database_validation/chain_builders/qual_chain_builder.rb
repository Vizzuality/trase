# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +qual_property+ present
#   check tooltip text present (WARN)
#   DONE if temporal set check year present, if not set check year absent
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
          checks :declared_temporal_matches_data,
                 association: :node_quals,
                 attribute: :is_temporal_on_actor_profile,
                 on: :qual_property,
                 link: {
                   method: :admin_qual_property_path,
                   params: [:qual_property]
                 }
          checks :declared_temporal_matches_data,
                 association: :node_quals,
                 attribute: :is_temporal_on_place_profile,
                 on: :qual_property,
                 link: {
                   method: :admin_qual_property_path,
                   params: [:qual_property]
                 }
        end
      end
    end
  end
end
