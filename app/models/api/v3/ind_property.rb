# == Schema Information
#
# Table name: ind_properties
#
#  id                                                                                 :integer          not null, primary key
#  ind_id                                                                             :integer          not null
#  display_name(Name of attribute for display)                                        :text             not null
#  unit_type(Type of unit, e.g. score. One of restricted set of values.)              :text
#  tooltip_text(Generic tooltip text (lowest precedence))                             :text
#  is_visible_on_place_profile(Whether to display this attribute on place profile)    :boolean          default(FALSE), not null
#  is_visible_on_actor_profile(Whether to display this attribute on actor profile)    :boolean          default(FALSE), not null
#  is_temporal_on_place_profile(Whether attribute has temporal data on place profile) :boolean          default(FALSE), not null
#  is_temporal_on_actor_profile(Whether attribute has temporal data on actor profile) :boolean          default(FALSE), not null
#
# Indexes
#
#  ind_properties_ind_id_key       (ind_id) UNIQUE
#  index_ind_properties_on_ind_id  (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class IndProperty < YellowTable
      include AttributePropertiesProfileScopes

      UNIT_TYPE = %w(
        currency
        ratio
        score
        unitless
      ).freeze

      belongs_to :ind

      validates :ind, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, inclusion: {in: UNIT_TYPE, allow_blank: true}
      validates :is_visible_on_place_profile, inclusion: {in: [true, false]}
      validates :is_visible_on_actor_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_place_profile, inclusion: {in: [true, false]}
      validates :is_temporal_on_actor_profile, inclusion: {in: [true, false]}

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
