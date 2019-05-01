# == Schema Information
#
# Table name: qual_country_properties
#
#  id                                                                                                                                                                                                                               :bigint(8)        not null, primary key
#  tooltip_text(Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).) :text             not null
#  country_id(Reference to country)                                                                                                                                                                                                 :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                                                                       :bigint(8)        not null
#
# Indexes
#
#  index_qual_country_properties_on_country_id  (country_id)
#  index_qual_country_properties_on_qual_id     (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QualCountryProperty < YellowTable
      belongs_to :country
      belongs_to :qual

      validates :country, presence: true
      validates :qual, presence: true, uniqueness: {scope: :country}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual},
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CountryAttributeProperty.refresh
      end
    end
  end
end
