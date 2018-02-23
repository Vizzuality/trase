# Prepares checks to be run on quant objects

# The following checks are included:
#   check +quant_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class QuantChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :quant_property,
                 link: :index
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_actor_profile,
                 on: :quant_property,
                 link: :edit
          checks :declared_temporal_matches_data,
                 association: :node_quants,
                 attribute: :is_temporal_on_place_profile,
                 on: :quant_property,
                 link: :edit
          checks :attribute_present,
                 attribute: :tooltip_text,
                 on: :quant_property,
                 link: :edit,
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
