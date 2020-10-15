# == Schema Information
#
# Table name: chart_quants
#
#  id                 :integer          not null, primary key
#  chart_attribute_id :integer          not null
#  quant_id           :integer          not null
#
# Indexes
#
#  chart_quants_chart_attribute_id_idx           (chart_attribute_id)
#  chart_quants_chart_attribute_id_quant_id_key  (chart_attribute_id,quant_id) UNIQUE
#  chart_quants_quant_id_idx                     (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (chart_attribute_id => chart_attributes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class ChartQuant < YellowTable
      belongs_to :chart_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::ChartAttribute}
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
