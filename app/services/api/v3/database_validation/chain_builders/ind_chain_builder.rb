# Prepares checks to be run on ind objects

# The following checks are included:
#   check +ind_property+ present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class IndChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :ind_property,
                 link: :index
          checks :declared_temporal_matches_data,
                 association: :node_inds,
                 attribute: :is_temporal_on_actor_profile,
                 on: :ind_property,
                 link: :edit
          checks :declared_temporal_matches_data,
                 association: :node_inds,
                 attribute: :is_temporal_on_place_profile,
                 on: :ind_property,
                 link: :edit
          checks :attribute_present,
                 attribute: :tooltip_text,
                 on: :ind_property,
                 link: :edit,
                 severity: :warn

          def self.build_chain
            chain = []
            Api::V3::Ind.all.each do |ind|
              chain += new(
                ind, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
