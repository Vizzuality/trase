module Api
  module V3
    module Dashboards
      class CommoditySerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
