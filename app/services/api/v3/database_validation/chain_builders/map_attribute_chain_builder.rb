# Prepares checks to be run on map_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   DONE check for widows (map_attributes without map_ind or map_quant)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class MapAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_data,
                 association: :map_ind,
                 link: {
                   method: :admin_map_attribute_path,
                   params: [:map_attribute]
                 }
          checks :declared_years_match_data,
                 association: :map_quant,
                 link: {
                   method: :admin_map_attribute_path,
                   params: [:map_attribute]
                 }
          checks :has_one_association_variant_present,
                 associations: [:map_ind, :map_quant],
                 link: {method: :admin_map_attributes_path}
        end
      end
    end
  end
end
