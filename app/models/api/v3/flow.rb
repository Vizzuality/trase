# == Schema Information
#
# Table name: flows
#
#  id                                                                                                                                                              :integer          not null, primary key
#  context_id                                                                                                                                                      :integer          not null
#  year(Year)                                                                                                                                                      :integer          not null
#  path(Array of node ids which constitute the supply chain, where position of node in this array is linked to the value of column_position in context_node_types) :integer          default([]), is an Array
#
# Indexes
#
#  flows_context_id_idx       (context_id)
#  flows_context_id_year_idx  (context_id,year)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#
module Api
  module V3
    class Flow < BlueTable
      belongs_to :context
      has_many :flow_inds
      has_many :flow_quals
      has_many :flow_quants

      MINIMUM_LENGTH = 4

      def self.import_key
        []
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
