# Prepares checks to be run on map_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   check for widows (map_attributes without map_ind or map_quant)
module Api
  module V3
    module DatabaseChecks
      class MapAttributeCheckChain < CheckChain
        validates :declared_years_match_data,
                  association: :map_ind,
                  link: {
                    method: :admin_map_attribute_path,
                    params: [:map_attribute]
                  }
        validates :declared_years_match_data,
                  association: :map_quant,
                  link: {
                    method: :admin_map_attribute_path,
                    params: [:map_attribute]
                  }
      end
    end
  end
end
