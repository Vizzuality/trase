# == Schema Information
#
# Table name: node_quants
#
#  id                                     :integer          not null, primary key
#  node_id                                :integer          not null
#  quant_id                               :integer          not null
#  year(Year; empty (NULL) for all years) :integer
#  value(Numeric value)                   :float            not null
#
# Indexes
#
#  index_node_quants_on_node_id           (node_id)
#  node_quants_node_id_quant_id_year_key  (node_id,quant_id,year) UNIQUE
#  node_quants_quant_id_idx               (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class NodeQuant < BlueTable
      belongs_to :quant
      belongs_to :node

      def self.for_context(context_id = nil)
        joins('LEFT JOIN nodes_mv ON node_quants.node_id = nodes_mv.id').where('nodes_mv.context_id = ?', context_id)
      end

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :quant_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
