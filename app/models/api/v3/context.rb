module Api
  module V3
    class Context < BaseModel
      belongs_to :country
      belongs_to :commodity
      has_one :context_property
      has_many :recolor_by_attributes
      has_many :readonly_recolor_by_attributes, class_name: 'Readonly::RecolorByAttribute'
      has_many :resize_by_attributes
      has_many :readonly_resize_by_attributes, class_name: 'Readonly::ResizeByAttribute'
      has_many :contextual_layers
      has_many :context_node_types

      delegate :is_default, to: :context_property
      delegate :is_disabled, to: :context_property
      delegate :is_subnational, to: :context_property
      delegate :default_basemap, to: :context_property
    end
  end
end
