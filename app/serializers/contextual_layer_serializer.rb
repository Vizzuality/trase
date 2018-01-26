class ContextualLayerSerializer < ActiveModel::Serializer
  attributes :id, :title, :identifier, :tooltip_text, :is_default, :legend, :raster_url
end
