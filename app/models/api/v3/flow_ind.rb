# == Schema Information
#
# Table name: flow_inds
#
#  id                   :integer          not null, primary key
#  flow_id              :integer          not null
#  ind_id               :integer          not null
#  value(Numeric value) :float            not null
#
# Indexes
#
#  flow_inds_flow_id_idx         (flow_id)
#  flow_inds_flow_id_ind_id_key  (flow_id,ind_id) UNIQUE
#  flow_inds_ind_id_idx          (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (flow_id => flows.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class FlowInd < BlueTable
      belongs_to :flow
      belongs_to :ind

      def self.import_key
        [
          {name: :flow_id, sql_type: "INT"},
          {name: :ind_id, sql_type: "INT"}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
