module Api
  module Private
    class MapAttributeSerializer < ActiveModel::Serializer
      attributes  :position,
                  :dual_layer_buckets,
                  :single_layer_buckets,
                  :color_scale,
                  :years,
                  :is_disabled,
                  :is_default

      has_one :map_ind, serializer: Api::Private::MapIndSerializer
      has_one :map_quant, serializer: Api::Private::MapQuantSerializer
    end
  end
end
