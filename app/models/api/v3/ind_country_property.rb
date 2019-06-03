# == Schema Information
#
# Table name: ind_country_properties
#
#  id                                                                                                                                                                                                                               :bigint(8)        not null, primary key
#  tooltip_text(Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).) :text             not null
#  country_id(Reference to country)                                                                                                                                                                                                 :bigint(8)        not null
#  ind_id(Reference to ind)                                                                                                                                                                                                         :bigint(8)        not null
#
# Indexes
#
#  ind_country_properties_country_id_idx  (country_id)
#  ind_country_properties_ind_id_idx      (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class IndCountryProperty < YellowTable
      belongs_to :country
      belongs_to :ind

      validates :country, presence: true
      validates :ind, presence: true, uniqueness: {scope: :country}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind},
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CountryAttributeProperty.refresh
      end
    end
  end
end
