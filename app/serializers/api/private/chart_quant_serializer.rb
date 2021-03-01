module Api
  module Private
    class ChartQuantSerializer < ActiveModel::Serializer
      belongs_to :quant, serializer: Api::Private::QuantRefSerializer
    end
  end
end
