# Prepares checks to be run on country objects

# The following checks are included:
#   check +country_property+ present
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class CountryChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :country_property,
                 link: :index
          checks :active_record_check, on: :country_property, link: :edit

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
