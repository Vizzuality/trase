# Prepares checks to be run on recolor_by_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   check for widows (recolor_by_attributes without recolor_by_ind or recolor_by_qual)
#   DONE check tooltip text present (WARN)
#   if min/max present, check interval present and vice versa (model validation?)
#   if legend percentual check divisor present (model validation?)
module Api
  module V3
    module DatabaseChecks
      class RecolorByAttributeCheckChain < CheckChain
        validates :declared_years_match_data,
                  association: :recolor_by_ind,
                  link: {
                    method: :admin_recolor_by_attribute_path,
                    params: [:recolor_by_attribute]
                  }
        validates :declared_years_match_data,
                  association: :recolor_by_qual,
                  link: {
                    method: :admin_recolor_by_attribute_path,
                    params: [:recolor_by_attribute]
                  }
        validates :attribute_present,
                  attribute: :tooltip_text,
                  link: {
                    method: :admin_recolor_by_attribute_path,
                    params: [:recolor_by_attribute]
                  },
                  severity: :warn
      end
    end
  end
end
