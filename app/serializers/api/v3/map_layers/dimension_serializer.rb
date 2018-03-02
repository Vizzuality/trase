module Api
  module V3
    module MapLayers
      class DimensionSerializer < ActiveModel::Serializer
        attributes :id, :name, :type, :dual_layer_buckets, :single_layer_buckets,
                   :group_id, :unit, :is_default, :layer_attribute_id,
                   :description, :color_scale, :years, :aggregate_method
      end
    end
  end
end
