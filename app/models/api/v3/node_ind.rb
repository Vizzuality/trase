# == Schema Information
#
# Table name: node_inds
#
#  id                                     :integer          not null, primary key
#  node_id                                :integer          not null
#  ind_id                                 :integer          not null
#  year(Year; empty (NULL) for all years) :integer
#  value(Numeric value)                   :float            not null
#
# Indexes
#
#  node_inds_ind_id_idx               (ind_id)
#  node_inds_node_id_idx              (node_id)
#  node_inds_node_id_ind_id_year_key  (node_id,ind_id,year) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade
#
module Api
  module V3
    class NodeInd < BlueTable
      belongs_to :ind
      belongs_to :node

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :ind_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
