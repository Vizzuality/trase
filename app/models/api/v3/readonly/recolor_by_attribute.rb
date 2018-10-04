# == Schema Information
#
# Table name: recolor_by_attributes_mv
#
#  id                 :integer          primary key
#  context_id         :integer
#  group_number       :integer
#  position           :integer
#  legend_type        :text
#  legend_color_theme :text
#  interval_count     :integer
#  min_value          :text
#  max_value          :text
#  divisor            :float
#  tooltip_text       :text
#  years              :integer          is an Array
#  is_disabled        :boolean
#  is_default         :boolean
#  created_at         :datetime
#  updated_at         :datetime
#  attribute_id       :integer
#
# Indexes
#
#  recolor_by_attributes_mv_context_id_attribute_id  (context_id,attribute_id)
#  recolor_by_attributes_mv_id_idx                   (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class RecolorByAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'recolor_by_attributes_mv'
        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute

        def self.refresh_dependencies(options = {})
          Api::V3::Readonly::Attribute.refresh(options)
        end
      end
    end
  end
end
