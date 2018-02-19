# Prepares checks to be run on recolor_by_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   DONE check for widows (recolor_by_attributes without recolor_by_ind or recolor_by_qual)
#   DONE check tooltip text present (WARN)
#   if min/max present, check interval present and vice versa (model validation?)
#   if legend percentual check divisor present (model validation?)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class RecolorByAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_data,
                 association: :recolor_by_ind,
                 link: {
                   method: :admin_recolor_by_attribute_path,
                   params: [:recolor_by_attribute]
                 }
          checks :declared_years_match_data,
                 association: :recolor_by_qual,
                 link: {
                   method: :admin_recolor_by_attribute_path,
                   params: [:recolor_by_attribute]
                 }
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: {
                   method: :admin_recolor_by_attribute_path,
                   params: [:recolor_by_attribute]
                 },
                 severity: :warn
          checks :has_one_association_variant_present,
                 associations: [:recolor_by_ind, :recolor_by_qual],
                 link: {method: :admin_recolor_by_attributes_path}
        end
      end
    end
  end
end
