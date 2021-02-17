module Api
  module Private
    class QuantSerializer < ActiveModel::Serializer
      attributes :name
      has_one :quant_property, serializer: Api::Private::QuantPropertySerializer
      has_many :quant_commodity_properties, serializer: Api::Private::QuantCommodityPropertySerializer
      has_many :quant_country_properties, serializer: Api::Private::QuantCountryPropertySerializer
      has_many :quant_context_properties, serializer: Api::Private::QuantContextPropertySerializer
    end
  end
end
