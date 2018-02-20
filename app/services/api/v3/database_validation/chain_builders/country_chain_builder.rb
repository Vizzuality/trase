# Prepares checks to be run on country objects

# The following checks are included:
#   DONE check +country_property+ present
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class CountryChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :country_property,
                 link: {method: :admin_country_properties_path}
        end
      end
    end
  end
end
