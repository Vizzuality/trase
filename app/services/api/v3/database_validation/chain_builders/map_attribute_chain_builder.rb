# Prepares checks to be run on map_attribute objects

# The following checks are included:
#   check years match data in flows
#   check for widows (map_attributes without map_ind or map_quant)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class MapAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_node_attributes,
                 association: :map_ind,
                 link: :edit
          checks :declared_years_match_node_attributes,
                 association: :map_quant,
                 link: :edit
          checks :has_exactly_one_of,
                 associations: [:map_ind, :map_quant],
                 link: :index
          checks :active_record_check, on: :map_attribute, link: :edit

          def self.build_chain(context)
            chain = []
            context.map_attributes.each do |map_attribute|
              chain += new(
                map_attribute, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
