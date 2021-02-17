module Api
  module Private
    class ResizeByQuantSerializer < ActiveModel::Serializer
      belongs_to :quant, serializer: Api::Private::QuantRefSerializer
    end
  end
end
