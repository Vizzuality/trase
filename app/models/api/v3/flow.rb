# == Schema Information
#
# Table name: flows
#
#  id         :integer          not null, primary key
#  context_id :integer          not null
#  year       :integer          not null
#  path       :integer          default([]), is an Array
#  created_at :datetime         not null
#
# Indexes
#
#  index_flows_on_context_id           (context_id)
#  index_flows_on_context_id_and_year  (context_id,year)
#  index_flows_on_path                 (path)
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
