module Api
  module V3
    class QualProperty < YellowTable
      include AttributePropertiesProfileScopes

      belongs_to :qual

      validates :qual, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :is_visible_on_place_profile, inclusion: {in: [true, false]}
      validates :is_visible_on_actor_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_place_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_actor_profile, inclusion: {in: [true, false]}

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
