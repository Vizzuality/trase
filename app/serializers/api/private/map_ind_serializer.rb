module Api
  module Private
    class MapIndSerializer < ActiveModel::Serializer
      belongs_to :ind, serializer: Api::Private::IndRefSerializer
    end
  end
end
