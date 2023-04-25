# == Schema Information
#
# Table name: resize_by_attributes_v
#
#  id                                                    :integer          primary key
#  attribute_id(References the unique id in attributes.) :bigint(8)
#  context_id                                            :integer
#  group_number                                          :integer
#  position                                              :integer
#  years                                                 :integer          is an Array
#  is_disabled                                           :boolean
#  is_default                                            :boolean
#  is_quick_fact                                         :boolean
#  tooltip_text                                          :text
#
module Api
  module V3
    module Readonly
      class ResizeByAttribute < Api::Readonly::BaseModel
        self.table_name = "resize_by_attributes_v"

        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: "Attribute"

        delegate :name, to: :readonly_attribute
        delegate :unit, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute
      end
    end
  end
end
