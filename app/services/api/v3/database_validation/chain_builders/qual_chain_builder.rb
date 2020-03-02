# Prepares checks to be run on qual objects

# The following checks are included:
#   check +qual_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class QualChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :qual_property,
                 link: :index
          checks :attribute_present,
                 attribute: :tooltip_text,
                 on: :qual_property,
                 link: :edit,
                 severity: :warn
          checks :active_record_check, on: :qual_property, link: :edit

          def self.build_chain
            chain = []
            Api::V3::Qual.all.each do |qual|
              chain += new(
                qual, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
