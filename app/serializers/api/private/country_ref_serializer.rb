module Api
  module Private
    class CountryRefSerializer < ActiveModel::Serializer
      attributes :name, :iso2
    end
  end
end
