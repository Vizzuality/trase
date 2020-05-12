# == Schema Information
#
# Table name: node_quals
#
#  id                                     :integer          not null, primary key
#  node_id                                :integer          not null
#  qual_id                                :integer          not null
#  year(Year; empty (NULL) for all years) :integer
#  value(Textual value)                   :text             not null
#
# Indexes
#
#  node_quals_node_id_idx               (node_id)
#  node_quals_node_id_qual_id_year_key  (node_id,qual_id,year) UNIQUE
#  node_quals_qual_id_idx               (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class NodeQual < BlueTable
      belongs_to :qual
      belongs_to :node

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :qual_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
