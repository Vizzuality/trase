module Api
  module V3
    module Profiles
      class ChartSerializer < ActiveModel::Serializer
        attributes :id, :chart_type, :identifier, :title, :position

        has_many :children, serializer: self

        attribute(:url) do
          chart_params = instance_options[:chart_params]
          activity = chart_params.delete(:activity)
          options = Api::V3::Profiles::ChartUrlOptions.url_options(
            object,
            chart_params.except(:year),
            activity
          )
          instance_options[:url_for].call(options)
        end
      end
    end
  end
end
