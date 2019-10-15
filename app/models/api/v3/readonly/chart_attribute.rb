# == Schema Information
#
# Table name: chart_attributes_mv
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
# Indexes
#
#  chart_attributes_mv_id_idx  (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class ChartAttribute < Api::Readonly::BaseModel
        self.table_name = 'chart_attributes_mv'

        belongs_to :chart

        def original_attribute
          return nil unless %w(Ind Qual Quant).include? original_type

          original_class = Api::V3.const_get(original_type)
          original_class.find(original_id)
        end
      end
    end
  end
end
