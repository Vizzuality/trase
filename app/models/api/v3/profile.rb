# == Schema Information
#
# Table name: profiles
#
#  id                   :integer          not null, primary key
#  context_node_type_id :integer          not null
#  name                 :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
# Indexes
#
#  index_profiles_on_context_node_type_id  (context_node_type_id)
#  profiles_context_node_type_id_name_key  (context_node_type_id,name) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#

module Api
  module V3
    class Profile < YellowTable
      ACTOR = 'actor'.freeze
      PLACE = 'place'.freeze

      NAME = [ACTOR, PLACE].freeze

      belongs_to :context_node_type

      validates :context_node_type, presence: true
      validates :name,
                uniqueness: {scope: :context_node_type},
                inclusion: NAME

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end
    end
  end
end
