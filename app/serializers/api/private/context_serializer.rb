module Api
  module Private
    class ContextSerializer < ActiveModel::Serializer
      belongs_to :commodity, serializer: Api::Private::CommodityRefSerializer
      belongs_to :country, serializer: Api::Private::CountryRefSerializer
      has_one :context_property, serializer: Api::Private::ContextPropertySerializer
      has_many :context_node_types, serializer: Api::Private::ContextNodeTypeSerializer
      has_many :recolor_by_attributes, serializer: Api::Private::RecolorByAttributeSerializer
      has_many :resize_by_attributes, serializer: Api::Private::ResizeByAttributeSerializer
      has_many :download_attributes, serializer: Api::Private::DownloadAttributeSerializer
      has_many :map_attribute_groups, serializer: Api::Private::MapAttributeGroupSerializer
      has_many :contextual_layers, serializer: Api::Private::ContextualLayerSerializer
    end
  end
end
