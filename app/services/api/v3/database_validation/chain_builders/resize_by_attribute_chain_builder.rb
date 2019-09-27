# Prepares checks to be run on resize_by_attribute objects

# The following checks are included:
#   check years match data in flows
#   check for zombies (resize_by_attributes without resize_by_quant)
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ResizeByAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_flow_attributes,
                 association: :resize_by_quant
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: :edit,
                 severity: :warn
          checks :has_exactly_one,
                 association: :resize_by_quant,
                 link: :index
          checks :active_record_check, on: :resize_by_attribute

          def self.build_chain(context)
            chain = []
            context.resize_by_attributes.each do |resize_by_attribute|
              chain += new(
                resize_by_attribute, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
