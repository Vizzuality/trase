module Api
  module Private
    class QualSerializer < ActiveModel::Serializer
      attributes :name
      has_one :qual_property, serializer: Api::Private::QualPropertySerializer
      has_many :qual_commodity_properties, serializer: Api::Private::QualCommodityPropertySerializer
      has_many :qual_country_properties, serializer: Api::Private::QualCountryPropertySerializer
      has_many :qual_context_properties, serializer: Api::Private::QualContextPropertySerializer
    end
  end
end
