module Api
  module V3
    class RecolorByAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

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
      has_one :recolor_by_ind, autosave: true
      has_one :recolor_by_qual, autosave: true

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position, presence: true, uniqueness: {scope: [:context, :group_number]}
      validates :legend_type, presence: true, inclusion: { in: LEGEND_TYPE }
      validates :legend_color_theme, presence: true, inclusion: { in: LEGEND_COLOR_THEME }
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }
      validates_with OneAssociatedAttributeValidator, {
        attributes: [:recolor_by_ind, :recolor_by_qual]
      }
      validates_with AttributeAssociatedOnceValidator,
        attribute: :recolor_by_ind, if: :new_recolor_by_ind_given?
      validates_with AttributeAssociatedOnceValidator,
        attribute: :recolor_by_qual, if: :new_recolor_by_qual_given?

      after_commit :refresh_dependencies

      stringy_array :years
      manage_associated_attributes [:recolor_by_ind, :recolor_by_qual]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependencies
        Api::V3::Readonly::RecolorByAttribute.refresh
      end
    end
  end
end
