# Prepares checks to be run on contextual_layer objects

# The following checks are included:
#   DONE check at least one carto layer present
#   DONE check tooltip text present (WARN)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class ContextualLayerChainBuilder < AbstractChainBuilder
          checks :has_many_association_any,
                 association: :carto_layers,
                 link: {method: :admin_carto_layers_path}
          checks :attribute_present,
                 attribute: :tooltip_text,
                 link: {
                   method: :admin_contextual_layer_path,
                   params: [:contextual_layer]
                 },
                 severity: :warn

          def self.build_chain(context)
            chain = []
            context.contextual_layers.each do |contextual_layer|
              chain += self.new(
                contextual_layer, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
