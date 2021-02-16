module Api
  module Private
    class RecolorByQualSerializer < ActiveModel::Serializer
      belongs_to :qual, serializer: Api::Private::QualRefSerializer
    end
  end
end
