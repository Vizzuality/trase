module Api
  module V3
    class Context < BaseModel
      belongs_to :country
      belongs_to :commodity

      has_many :recolor_by_attributes
      has_many :m_recolor_by_attributes
      has_many :resize_by_attributes
      has_many :m_resize_by_attributes
      has_many :contextual_layers
      has_many :context_node_types
    end
  end
end
