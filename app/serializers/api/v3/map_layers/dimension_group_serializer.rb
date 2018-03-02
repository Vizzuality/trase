module Api
  module V3
    module MapLayers
      class DimensionGroupSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
