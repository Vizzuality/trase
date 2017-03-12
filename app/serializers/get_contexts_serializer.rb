class GetContextsSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :years, :default_year, :country_id, :commodity_id

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

  attribute :commodity_name do
    object.commodity.name
  end
end
