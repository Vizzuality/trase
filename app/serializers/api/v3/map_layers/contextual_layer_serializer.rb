module Api
  module V3
    module MapLayers
      class ContextualLayerSerializer < ActiveModel::Serializer
        attributes :id, :title, :identifier, :tooltip_text, :is_default,
                   :legend, :raster_url
      end
    end
  end
end
