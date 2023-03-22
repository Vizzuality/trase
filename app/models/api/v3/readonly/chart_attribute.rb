# == Schema Information
#
# Table name: chart_attributes_v
#
#  id                                                                          :integer          primary key
#  chart_id                                                                    :integer
#  position                                                                    :integer
#  years                                                                       :integer          is an Array
#  display_name(If absent in chart_attributes this is pulled from attributes.) :text
#  legend_name                                                                 :text
#  display_type                                                                :text
#  display_style                                                               :text
#  state_average                                                               :boolean
#  identifier                                                                  :text
#  name                                                                        :text
#  unit                                                                        :text
#  tooltip_text                                                                :text
#  attribute_id                                                                :bigint(8)
#  original_id                                                                 :integer
#  original_type                                                               :text
#
module Api
  module V3
    module Readonly
      class ChartAttribute < Api::Readonly::BaseModel
        self.table_name = "chart_attributes_v"

        belongs_to :chart
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: "Attribute"

        def original_attribute
          return nil unless %w(Ind Qual Quant).include? original_type

          original_class = Api::V3.const_get(original_type)
          original_class.find(original_id)
        end
      end
    end
  end
end
