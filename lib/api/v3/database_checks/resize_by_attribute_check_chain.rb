# Prepares checks to be run on resize_by_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   check for widows (resize_by_attributes without resize_by_quant)
#   DONE check tooltip text present (WARN)
module Api
  module V3
    module DatabaseChecks
      class ResizeByAttributeCheckChain < CheckChain
        validates :declared_years_match_data,
                  association: :resize_by_quant,
                  link: {
                    method: :admin_resize_by_attribute_path,
                    params: [:resize_by_attribute]
                  }
        validates :attribute_present,
                  attribute: :tooltip_text,
                  link: {
                    method: :admin_resize_by_attribute_path,
                    params: [:resize_by_attribute]
                  },
                  severity: :warn
      end
    end
  end
end
