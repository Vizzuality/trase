module Api
  module Public
    class CountrySerializer < ActiveModel::Serializer
      attributes :id, :name, :iso2
    end
  end
end
