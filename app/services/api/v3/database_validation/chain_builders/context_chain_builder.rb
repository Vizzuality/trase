# Prepares checks to be run on context objects

# The following checks are included:
#   check +context_property+ present
#   check +context_node_types+ contain +COUNTRY+ and +EXPORTER+
#   check any actor / place +profiles+ present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ContextChainBuilder < AbstractChainBuilder
          checks :has_exactly_one,
                 association: :context_property,
                 link: :index
          checks :required_node_types_present
          checks :has_at_least_one_profile,
                 profile_type: Api::V3::Profile::ACTOR,
                 link: :index,
                 severity: :warn
          checks :has_at_least_one_profile,
                 profile_type: Api::V3::Profile::PLACE,
                 link: :index,
                 severity: :warn
          checks :has_at_least_one,
                 association: :download_attributes,
                 link: :index
          checks :has_at_least_one,
                 association: :map_attributes,
                 link: :index
          checks :has_at_least_one,
                 association: :recolor_by_attributes
          checks :has_at_least_one,
                 association: :resize_by_attributes
          checks :has_at_least_one,
                 association: :contextual_layers,
                 link: :index
          checks :path_length_matches_context_node_types
          checks :path_positions_match_context_node_types
          checks :active_record_check, on: :context_property, link: :edit

          CHAIN_BUILDERS = [
            ContextNodeTypeChainBuilder,
            ResizeByAttributeChainBuilder,
            RecolorByAttributeChainBuilder,
            DownloadAttributeChainBuilder,
            MapAttributeChainBuilder,
            ContextualLayerChainBuilder
          ].freeze

          def self.build_chain
            chain = []
            Api::V3::Context.all.each do |context|
              chain += new(context, @errors_list).chain
              CHAIN_BUILDERS.each do |chain_builder_class|
                chain += chain_builder_class.build_chain(context)
              end
            end
            chain
          end

          def self.human_readable_rules
            result = super

            # nested chain builders
            CHAIN_BUILDERS.each do |chain_builder|
              result << chain_builder.human_readable_rules
            end

            result
          end
        end
      end
    end
  end
end
