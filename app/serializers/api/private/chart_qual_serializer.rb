module Api
  module Private
    class ChartQualSerializer < ActiveModel::Serializer
      belongs_to :qual, serializer: Api::Private::QualRefSerializer
    end
  end
end
