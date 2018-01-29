module Api
  module V3
    class ContextProperty < YellowTable
      DEFAULT_BASEMAP = [
        'default',
        'satellite',
        'topo',
        'streets'
      ].freeze

      belongs_to :context

      validates :context, presence: true, uniqueness: true
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }
      validates :is_subnational, inclusion: { in: [true, false] }
      validates :default_basemap, inclusion: { in: DEFAULT_BASEMAP, allow_blank: true }

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
