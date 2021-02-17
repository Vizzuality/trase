module Api
  module Private
    class RecolorByIndSerializer < ActiveModel::Serializer
      belongs_to :ind, serializer: Api::Private::IndRefSerializer
    end
  end
end
