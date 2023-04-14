# == Schema Information
#
# Table name: flow_quals
#
#  id                   :integer          not null, primary key
#  flow_id              :integer          not null
#  qual_id              :integer          not null
#  value(Textual value) :text             not null
#
# Indexes
#
#  flow_quals_flow_id_idx          (flow_id)
#  flow_quals_flow_id_qual_id_key  (flow_id,qual_id) UNIQUE
#  flow_quals_qual_id_idx          (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (flow_id => flows.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class FlowQual < BlueTable
      belongs_to :flow
      belongs_to :qual

      def self.import_key
        [
          {name: :flow_id, sql_type: "INT"},
          {name: :qual_id, sql_type: "INT"}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
