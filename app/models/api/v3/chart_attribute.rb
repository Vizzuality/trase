# == Schema Information
#
# Table name: chart_attributes
#
#  id            :integer          not null, primary key
#  chart_id      :integer          not null
#  position      :integer
#  years         :integer          is an Array
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  display_name  :text
#  legend_name   :text
#  display_type  :text
#  display_style :text
#  state_average :boolean          default(FALSE), not null
#
# Indexes
#
#  chart_attributes_chart_id_position_key  (chart_id,position) UNIQUE
#  index_chart_attributes_on_chart_id      (chart_id)
#
# Foreign Keys
#
#  fk_rails_...  (chart_id => charts.id) ON DELETE => cascade
#

module Api
  module V3
    class ChartAttribute < YellowTable
      def self.yellow_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart}
        ]
      end
    end
  end
end
