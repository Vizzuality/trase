module Api
  module Private
    class ChartIndSerializer < ActiveModel::Serializer
      belongs_to :ind, serializer: Api::Private::IndRefSerializer
    end
  end
end
