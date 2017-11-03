module Api
  module V3
    module GetContexts
      class ContextSerializer < ActiveModel::Serializer
        attributes :id, :is_default, :is_disabled, :years, :default_year, :country_id, :commodity_id, :default_basemap

        has_many :m_recolor_by_attributes, key: :recolor_by
        has_many :m_resize_by_attributes, key: :resize_by

        attribute :default_context_layers do
          object.contextual_layers.default.pluck(:identifier)
        end
        attribute :country_name do
          object.country.name
        end

        attribute :map do
          {
              latitude: object.country.latitude,
              longitude: object.country.longitude,
              zoom: object.country.zoom
          }
        end

        attribute :commodity_name do
          object.commodity.name
        end
      end

    end
  end
end
