module Api
  module V3
    class RecolorByAttribute < YellowTable
      include Api::V3::StringyArray

      LEGEND_TYPE = [
        'qual',
        'linear',
        'stars',
        'percentual'
      ].freeze

      LEGEND_COLOR_THEME = [
        'thematic',
        'blue-green',
        'yellow-green',
        'red-blue',
        'yes-no'
        ].freeze

      belongs_to :context
      has_many :recolor_by_inds
      has_many :recolor_by_quals

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position, presence: true, uniqueness: {scope: [:context, :group_number]}
      validates :legend_type, presence: true, inclusion: { in: LEGEND_TYPE }
      validates :legend_color_theme, presence: true, inclusion: { in: LEGEND_COLOR_THEME }
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }

      stringy_array :years

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
