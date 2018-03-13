# == Schema Information
#
# Table name: chart_quants
#
#  id                 :integer          not null, primary key
#  chart_attribute_id :integer          not null
#  quant_id           :integer          not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  chart_quants_chart_attribute_id_quant_id_key  (chart_attribute_id,quant_id) UNIQUE
#  index_chart_quants_on_chart_attribute_id      (chart_attribute_id)
#  index_chart_quants_on_quant_id                (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (chart_attribute_id => chart_attributes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class ChartQuant < YellowTable
      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::Chart}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
