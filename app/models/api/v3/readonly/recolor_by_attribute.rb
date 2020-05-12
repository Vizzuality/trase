# == Schema Information
#
# Table name: recolor_by_attributes_v
#
#  id                                                    :integer          primary key
#  attribute_id(References the unique id in attributes.) :bigint(8)
#  context_id                                            :integer
#  group_number                                          :integer
#  position                                              :integer
#  interval_count                                        :integer
#  divisor                                               :float
#  is_disabled                                           :boolean
#  is_default                                            :boolean
#  years                                                 :integer          is an Array
#  min_value                                             :text
#  max_value                                             :text
#  legend_type                                           :text
#  legend_color_theme                                    :text
#  tooltip_text                                          :text
#  legend                                                :text             is an Array
#
module Api
  module V3
    module Readonly
      class RecolorByAttribute < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'recolor_by_attributes_v'

        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute
      end
    end
  end
end
