module Api
  module V3
    module MapLayers
      class ContextualLayerSerializer < ActiveModel::Serializer
        attributes :id, :title, :identifier, :tooltip_text, :is_default,
                   :legend
        has_many :carto_layers
      end
    end
  end
end
