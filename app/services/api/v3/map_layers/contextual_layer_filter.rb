module Api
  module V3
    module MapLayers
      class ContextualLayerFilter
        def initialize(context)
          @context = context
        end

        def call
          @contextual_layers = Api::V3::ContextualLayer.
            select([
              "title",
              "#{Api::V3::ContextualLayer.table_name}.identifier",
              "tooltip_text",
              "#{Api::V3::ContextualLayer.table_name}.id",
              "position",
              "is_default",
              "legend"
            ]).
            includes(:carto_layers).
            where(context_id: @context.id).
            order(position: :asc, id: :asc)
        end
      end
    end
  end
end
