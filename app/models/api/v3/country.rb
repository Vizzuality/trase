# == Schema Information
#
# Table name: countries
#
#  id                      :integer          not null, primary key
#  name(Country name)      :text             not null
#  iso2(2-letter ISO code) :text             not null
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

      has_many :ind_country_properties
      has_many :quant_country_properties
      has_many :qual_country_properties

      has_many :sankey_card_links

      delegate :latitude, to: :country_property
      delegate :longitude, to: :country_property
      delegate :zoom, to: :country_property
      delegate :annotation_position_x_pos, to: :country_property
      delegate :annotation_position_y_pos, to: :country_property

      validates :name, presence: true
      validates :iso2, presence: true, uniqueness: true

      def self.import_key
        [
          {name: :iso2, sql_type: 'TEXT'}
        ]
      end

      def self.select_options
        order(:name).map { |commodity| [commodity.name, commodity.id] }
      end
    end
  end
end
