module Api
  module Private
    class DownloadQualSerializer < ActiveModel::Serializer
      belongs_to :qual, serializer: Api::Private::QualRefSerializer
    end
  end
end
