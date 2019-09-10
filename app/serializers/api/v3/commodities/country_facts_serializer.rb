module Api
  module V3
    module Commodities
      class CountryFactsSerializer < ActiveModel::Serializer
        attributes :country_id
        has_many :facts, serializer: CountryFactSerializer
      end
    end
  end
end
