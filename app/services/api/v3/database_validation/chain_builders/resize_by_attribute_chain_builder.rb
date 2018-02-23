# Prepares checks to be run on resize_by_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   DONE check for widows (resize_by_attributes without resize_by_quant)
#   DONE check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ResizeByAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_data,
                 association: :resize_by_quant,
                 link: :edit
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: :edit,
                 severity: :warn
          checks :has_exactly_one,
                 association: :resize_by_quant,
                 link: :index

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
