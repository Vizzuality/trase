module Api
  module V3
    class Profile < YellowTable
      NAME = [
        'actor',
        'place'
      ].freeze

      belongs_to :context_node_type

      validates :context_node_type, presence: true
      validates :name, uniqueness: {scope: :context_node_type},
        inclusion: NAME

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end
    end
  end
end
