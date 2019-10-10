# Prepares checks to be run on recolor_by_attribute objects

# The following checks are included:
#   check years match data in flows
#   check for zombies (recolor_by_attributes without recolor_by_ind or recolor_by_qual)
#   check tooltip text present (WARN)
#   if min/max present, check interval present and vice versa (model validation?)
#   if legend percentual check divisor present (model validation?)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class RecolorByAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_flow_attributes,
                 association: :recolor_by_ind
          checks :declared_years_match_flow_attributes,
                 association: :recolor_by_qual
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: :edit,
                 severity: :warn
          checks :has_exactly_one_of,
                 associations: [:recolor_by_ind, :recolor_by_qual],
                 link: :index
          checks :active_record_check, on: :recolor_by_attribute

          def self.build_chain(context)
            chain = []
            context.recolor_by_attributes.each do |recolor_by_attribute|
              chain += new(
                recolor_by_attribute, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
