module Api
  module V3
    class IndProperty < YellowTable
      include AttributePropertiesProfileScopes

      UNIT_TYPE = [
        'currency',
        'ratio',
        'score',
        'unitless'
      ].freeze

      belongs_to :ind

      validates :ind, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, inclusion: {in: UNIT_TYPE, allow_blank: true}
      validates :is_visible_on_place_profile, inclusion: {in: [true, false]}
      validates :is_visible_on_actor_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_place_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_actor_profile, inclusion: {in: [true, false]}

      after_commit :refresh_dependencies

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end

      def refresh_dependencies
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
