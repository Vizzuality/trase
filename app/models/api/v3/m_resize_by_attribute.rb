module Api
  module V3
    class MResizeByAttribute < BaseModel
      self.table_name = 'resize_by_attributes_mv'
      belongs_to :context
      belongs_to :m_attribute, foreign_key: :attribute_id

      delegate :name, to: :m_attribute
      delegate :display_name, to: :m_attribute
      delegate :original_type, to: :m_attribute
      delegate :original_id, to: :m_attribute
    end
  end
end
