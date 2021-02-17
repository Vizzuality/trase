module Api
  module Private
    class MapQuantSerializer < ActiveModel::Serializer
      belongs_to :quant, serializer: Api::Private::QuantRefSerializer
    end
  end
end
