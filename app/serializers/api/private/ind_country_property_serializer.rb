module Api
  module Private
    class IndCountryPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :tooltip_text
      belongs_to :country, serializer: Api::Private::CountryRefSerializer
    end
  end
end
