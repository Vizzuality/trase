# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +quant_property+ present
#   DONE if temporal set check year present, if not set check year absent
#   DONE check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class QuantChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :quant_property,
                 link: {method: :admin_quant_properties_path}
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_actor_profile,
                 on: :quant_property,
                 link: {
                   method: :admin_quant_property_path,
                   member: :quant_property
                 }
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_place_profile,
                 on: :quant_property,
                 link: {
                   method: :admin_quant_property_path,
                   member: :quant_property
                 }
          checks :attribute_present,
                 attribute: :tooltip_text,
                 on: :quant_property,
                 link: {
                   method: :admin_quant_property_path,
                   member: :quant_property
                 },
                 severity: :warn

          def self.build_chain
            chain = []
            Api::V3::Quant.all.each do |quant|
              chain += new(
                quant, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
