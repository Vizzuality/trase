module Api
  module V3
    module Commodities
      class CountryFactSerializer < ActiveModel::Serializer
        attributes :year, :attribute_id, :total
      end
    end
  end
end
