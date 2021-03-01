module Api
  module Private
    class DownloadAttributeSerializer < ActiveModel::Serializer
      attributes  :position,
                  :years,
                  :display_name
      has_one :download_qual, serializer: Api::Private::DownloadQualSerializer
      has_one :download_quant, serializer: Api::Private::DownloadQuantSerializer
    end
  end
end
