module Api
  module V3
    module Dashboards
      class ParametrisedChartSerializer < ActiveModel::Serializer
        attribute(:type) { object[:type] }
        attribute(:url) { instance_options[:url].call(object) }
      end
    end
  end
end
