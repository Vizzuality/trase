module Api
  module V3
    module Dashboards
      class CountrySerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
