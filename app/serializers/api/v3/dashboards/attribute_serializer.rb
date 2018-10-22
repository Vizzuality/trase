module Api
  module V3
    module Dashboards
      class AttributeSerializer < ActiveModel::Serializer
        attributes :id, :display_name, :tooltip_text

        attribute :group_id do
          object['dashboards_attribute_group_id']
        end

        attribute :chart_type do
          object['chart_type']
        end

        attribute :is_disabled do
          object['is_disabled']
        end

        attribute :url do
          instance_options[:url].call(
            instance_options[:url_opts].merge(attribute_id: object.id)
          )
        end
      end
    end
  end
end
