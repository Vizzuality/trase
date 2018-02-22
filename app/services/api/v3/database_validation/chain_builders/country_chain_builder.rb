# Prepares checks to be run on country objects

# The following checks are included:
#   DONE check +country_property+ present
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class CountryChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :country_property,
                 link: {method: :admin_country_properties_path}

          def self.build_chain
            chain = []
            Api::V3::Country.all.each do |country|
              chain += new(
                country, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
