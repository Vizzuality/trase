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
                 link: {
                   method: :admin_resize_by_attribute_path,
                   params: [:resize_by_attribute]
                 }
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: {
                   method: :admin_resize_by_attribute_path,
                   params: [:resize_by_attribute]
                 },
                 severity: :warn
          checks :has_one_association_present,
                 association: :resize_by_quant,
                 link: {method: :admin_resize_by_attributes_path}

          def self.build_chain(context)
            chain = []
            context.resize_by_attributes.each do |resize_by_attribute|
              chain += self.new(
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
