# == Schema Information
#
# Table name: top_profiles
#
#  id         :bigint(8)        not null, primary key
#  context_id :bigint(8)        not null
#  node_id    :bigint(8)        not null
#
# Indexes
#
#  index_top_profiles_on_context_id  (context_id)
#  index_top_profiles_on_node_id     (node_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id)
#  fk_rails_...  (node_id => nodes.id)
#

module Api
  module V3
    class TopProfile < YellowTable
      belongs_to :context
      belongs_to :node

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context},
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
