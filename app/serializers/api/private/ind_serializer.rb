module Api
  module Private
    class IndSerializer < ActiveModel::Serializer
      attributes :name
      has_one :ind_property, serializer: Api::Private::IndPropertySerializer
      has_many :ind_commodity_properties, serializer: Api::Private::IndCommodityPropertySerializer
      has_many :ind_country_properties, serializer: Api::Private::IndCountryPropertySerializer
      has_many :ind_context_properties, serializer: Api::Private::IndContextPropertySerializer
    end
  end
end
