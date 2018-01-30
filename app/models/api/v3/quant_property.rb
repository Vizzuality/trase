module Api
  module V3
    class QuantProperty < YellowTable
      include AttributePropertiesProfileScopes

      UNIT_TYPE = [
        'currency',
        'area',
        'count',
        'volume',
        'unitless'
      ].freeze

      belongs_to :quant

      validates :quant, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, inclusion: {in: UNIT_TYPE, allow_blank: true}
      validates :is_visible_on_place_profile, inclusion: {in: [true, false]}
      validates :is_visible_on_actor_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_place_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_actor_profile, inclusion: {in: [true, false]}

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
