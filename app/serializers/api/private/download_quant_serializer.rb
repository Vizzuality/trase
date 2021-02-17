module Api
  module Private
    class DownloadQuantSerializer < ActiveModel::Serializer
      belongs_to :quant, serializer: Api::Private::QuantRefSerializer
    end
  end
end
