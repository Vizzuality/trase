module Api
  module Private
    class ContextRefSerializer < ActiveModel::Serializer
      belongs_to :commodity, serializer: Api::Private::CommodityRefSerializer
      belongs_to :country, serializer: Api::Private::CountryRefSerializer
    end
  end
end
