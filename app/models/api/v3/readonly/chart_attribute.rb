# == Schema Information
#
# Table name: chart_attributes_mv
#
#  id            :integer          primary key
#  chart_id      :integer
#  position      :integer
#  years         :integer          is an Array
#  display_name  :text
#  legend_name   :text
#  display_type  :text
#  display_style :text
#  state_average :boolean
#  name          :text
#  unit          :text
#  tooltip_text  :text
#  attribute_id  :integer
#  original_id   :integer
#  original_type :text
#  created_at    :datetime
#  updated_at    :datetime
#
# Indexes
#
#  chart_attributes_mv_chart_id_idx  (chart_id)
#  chart_attributes_mv_id_idx        (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class ChartAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'chart_attributes_mv'

        belongs_to :chart

        def to_attribute_hash
          {
            name: display_name,
            attribute_type: original_type.downcase,
            attribute_name: name,
            legend_name: legend_name,
            type: display_type,
            style: display_style,
            state_average: state_average
          }
        end
      end
    end
  end
end
