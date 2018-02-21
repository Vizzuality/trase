# Prepares checks to be run on context objects

# The following checks are included:
#   DONE check +context_property+ present
#   DONE check +context_node_types+ contain +COUNTRY+ and +EXPORTER+
#   DONE check any actor / place +profiles+ present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ContextChainBuilder < AbstractChainBuilder
          checks :has_one_association_present,
                 association: :context_property,
                 link: {method: :admin_context_properties_path}
          checks :required_node_types_present
          checks :has_at_least_one_profile,
                 profile_type: Api::V3::Profile::ACTOR,
                 link: {method: :admin_profiles_path},
                 severity: :warn
          checks :has_at_least_one_profile,
                 profile_type: Api::V3::Profile::PLACE,
                 link: {method: :admin_profiles_path},
                 severity: :warn
          checks :has_many_association_any,
                 association: :download_attributes,
                 link: {method: :admin_download_attributes_path}
          checks :has_many_association_any,
                 association: :map_attributes,
                 link: {method: :admin_map_attributes_path}
          checks :has_many_association_any,
                 association: :recolor_by_attributes,
                 link: {method: :admin_recolor_by_attributes_path}
          checks :has_many_association_any,
                 association: :resize_by_attributes,
                 link: {method: :admin_resize_by_attributes_path}
          checks :has_many_association_any,
                 association: :contextual_layers,
                 link: {method: :admin_contextual_layers_path}

          def self.build_chain
            chain = []
            Api::V3::Context.all.each do |context|
              chain += self.new(context, @errors_list).chain
              chain += ContextNodeTypeChainBuilder.build_chain(context)
              chain += ResizeByAttributeChainBuilder.build_chain(context)
              chain += RecolorByAttributeChainBuilder.build_chain(context)
              chain += DownloadAttributeChainBuilder.build_chain(context)
              chain += MapAttributeChainBuilder.build_chain(context)
              chain += ContextualLayerChainBuilder.build_chain(context)
            end
            chain
          end
        end
      end
    end
  end
end
