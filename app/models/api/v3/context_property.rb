# == Schema Information
#
# Table name: context_properties
#
#  id              :integer          not null, primary key
#  context_id      :integer          not null
#  default_basemap :text
#  is_disabled     :boolean          default(FALSE), not null
#  is_default      :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  is_subnational  :boolean          default(FALSE), not null
#
# Indexes
#
#  context_properties_context_id_key       (context_id) UNIQUE
#  index_context_properties_on_context_id  (context_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#

module Api
  module V3
    class ContextProperty < YellowTable
      DEFAULT_BASEMAP = %w(
        default
        satellite
        topo
        streets
      ).freeze

      belongs_to :context

      validates :context, presence: true, uniqueness: true
      validates :is_disabled, inclusion: {in: [true, false]}
      validates :is_default, inclusion: {in: [true, false]}
      validates :is_subnational, inclusion: {in: [true, false]}
      validates :default_basemap, inclusion: {in: DEFAULT_BASEMAP, allow_blank: true}

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
