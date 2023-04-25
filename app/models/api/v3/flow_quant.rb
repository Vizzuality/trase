# == Schema Information
#
# Table name: flow_quants
#
#  id                   :integer          not null, primary key
#  flow_id              :integer          not null
#  quant_id             :integer          not null
#  value(Numeric value) :float            not null
#
# Indexes
#
#  flow_quants_flow_id_idx           (flow_id)
#  flow_quants_flow_id_quant_id_key  (flow_id,quant_id) UNIQUE
#  flow_quants_quant_id_idx          (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (flow_id => flows.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class FlowQuant < BlueTable
      belongs_to :flow
      belongs_to :quant

      def self.import_key
        [
          {name: :flow_id, sql_type: "INT"},
          {name: :quant_id, sql_type: "INT"}
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
