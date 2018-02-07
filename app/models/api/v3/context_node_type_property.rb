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
