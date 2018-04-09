module Api
  module V3
    module MapLayers
      class CartoLayerSerializer < ActiveModel::Serializer
        attributes :identifier, :years, :raster_url
      end
    end
  end
end
