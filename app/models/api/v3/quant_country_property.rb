# == Schema Information
#
# Table name: quant_country_properties
#
#  id                                                                                                                                                                                                                               :bigint(8)        not null, primary key
#  tooltip_text(Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).) :text             not null
#  country_id(Reference to country)                                                                                                                                                                                                 :bigint(8)        not null
#  quant_id(Reference to quant)                                                                                                                                                                                                     :bigint(8)        not null
#
# Indexes
#
#  index_quant_country_properties_on_country_id  (country_id)
#  index_quant_country_properties_on_quant_id    (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QuantCountryProperty < YellowTable
      belongs_to :country
      belongs_to :quant

      validates :country, presence: true
      validates :quant, presence: true, uniqueness: {scope: :country}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant},
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CountryAttributeProperty.refresh
      end
    end
  end
end
