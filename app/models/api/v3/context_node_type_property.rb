# == Schema Information
#
# Table name: context_node_type_properties
#
#  id                     :integer          not null, primary key
#  context_node_type_id   :integer          not null
#  column_group           :integer          not null
#  is_default             :boolean          default(FALSE), not null
#  is_geo_column          :boolean          default(FALSE), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  is_choropleth_disabled :boolean          default(FALSE), not null
#
# Indexes
#
#  context_node_type_properties_context_node_type_id_key       (context_node_type_id) UNIQUE
#  index_context_node_type_properties_on_context_node_type_id  (context_node_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#

module Api
  module V3
    class ContextNodeTypeProperty < YellowTable
      COLUMN_GROUP = [
        0, 1, 2, 3
      ].freeze

      belongs_to :context_node_type

      validates :context_node_type, presence: true, uniqueness: true
      validates :column_group, presence: true, inclusion: COLUMN_GROUP
      validates :is_default, inclusion: {in: [true, false]}
      validates :is_geo_column, inclusion: {in: [true, false]}
      validates :is_choropleth_disabled, inclusion: {in: [true, false]}

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end
    end
  end
end
