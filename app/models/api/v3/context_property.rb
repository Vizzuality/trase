# == Schema Information
#
# Table name: context_properties
#
#  id                                                                                  :integer          not null, primary key
#  context_id                                                                          :integer          not null
#  default_basemap(Default basemap for this context, e.g. satellite)                   :text
#  is_disabled(When set, do not show this context)                                     :boolean          default(FALSE), not null
#  is_default(When set, show this context as default (only use for one))               :boolean          default(FALSE), not null
#  is_subnational(When set, show indication that sub-national level data is available) :boolean          default(FALSE), not null
#  is_highlighted(When set, shows the context on the context picker suggestions)       :boolean
#
# Indexes
#
#  context_properties_context_id_key  (context_id) UNIQUE
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
      validates :is_highlighted, inclusion: {in: [true, false]}
      validates :default_basemap, inclusion: {in: DEFAULT_BASEMAP, allow_blank: true}

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
