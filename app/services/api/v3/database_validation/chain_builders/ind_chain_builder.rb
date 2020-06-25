# Prepares checks to be run on ind objects

# The following checks are included:
#   check +ind_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class IndChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :ind_property,
                 link: :index
          checks :attribute_present,
                 attribute: :tooltip_text,
                 on: :ind_property,
                 link: :edit,
                 severity: :warn
          checks :active_record_check, on: :ind_property, link: :edit

          def self.build_chain
            chain = []
            Api::V3::Ind.all.each do |ind|
              chain += new(
                ind, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
