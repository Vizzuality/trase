module Api
  module Private
    class ContextualLayerSerializer < ActiveModel::Serializer
      attributes  :identifier,
                  :title,
                  :position,
                  :legend,
                  :tooltip_text
                  :is_default

      has_many :carto_layers, serializer: Api::Private::CartoLayerSerializer
    end
  end
end
