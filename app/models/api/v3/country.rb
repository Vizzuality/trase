# == Schema Information
#
# Table name: countries
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  iso2       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  countries_iso2_key  (iso2) UNIQUE
#

module Api
  module V3
    class Country < BlueTable
      has_one :country_property
      has_many :contexts

      has_many :dashboard_template_countries
      has_many :dashboard_templates, through: :dashboard_template_countries

      delegate :latitude, to: :country_property
      delegate :longitude, to: :country_property
      delegate :zoom, to: :country_property

      validates :name, presence: true
      validates :iso2, presence: true, uniqueness: true

      def self.import_key
        [
          {name: :iso2, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
