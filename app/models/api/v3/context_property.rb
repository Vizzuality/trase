# == Schema Information
#
# Table name: context_properties
#
#  id                                                                            :integer          not null, primary key
#  context_id                                                                    :integer          not null
#  default_basemap(Default basemap for this context, e.g. satellite)             :text
#  is_disabled(When set, do not show this context)                               :boolean          default(FALSE), not null
#  is_default(When set, show this context as default (only use for one))         :boolean          default(FALSE), not null
#  is_highlighted(When set, shows the context on the context picker suggestions) :boolean
#  subnational_years                                                             :integer          is an Array
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
      include Api::V3::StringyArray

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
      validates :is_highlighted, inclusion: {in: [true, false]}
      validates :default_basemap, inclusion: {in: DEFAULT_BASEMAP, allow_blank: true}

      stringy_array :subnational_years

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def is_subnational
        subnational_years && subnational_years.any?
      end
    end
  end
end
