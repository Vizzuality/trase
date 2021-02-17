module Api
  module Private
    class CartoLayerSerializer < ActiveModel::Serializer
      attributes  :identifier,
                  :years,
                  :raster_url
    end
  end
end
