module Api
  module Public
    class CountrySerializer < ActiveModel::Serializer
      attributes :id, :name
    end
  end
end
