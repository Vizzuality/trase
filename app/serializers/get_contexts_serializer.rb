class GetContextsSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :is_disabled, :years, :default_year, :country_id, :commodity_id, :default_basemap, :default_context_layers

  has_many :context_recolor_bies, serializer: RecolorBySerializer, key: :recolor_by
  has_many :context_resize_bies, serializer: ResizeBySerializer, key: :resize_by
  has_many :context_filter_bies, serializer: FilterBySerializer, key: :filter_by

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

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_default do
    object.is_default.present?
  end

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_disabled do
    object.is_disabled.present?
  end

  attribute :commodity_name do
    object.commodity.name
  end
end
