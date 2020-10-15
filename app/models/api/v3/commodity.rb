# == Schema Information
#
# Table name: commodities
#
#  id                                              :integer          not null, primary key
#  name(Commodity name; unique across commodities) :text             not null
#
# Indexes
#
#  commodities_name_key  (name) UNIQUE
#
module Api
  module V3
    class Commodity < BlueTable
      has_many :contexts

      has_many :dashboard_template_commodities
      has_many :dashboard_templates, through: :dashboard_template_commodities

      has_many :ind_commodity_properties
      has_many :quant_commodity_properties
      has_many :qual_commodity_properties

      has_many :sankey_card_links

      validates :name, presence: true, uniqueness: true

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end

      def self.select_options
        order(:name).map { |commodity| [commodity.name, commodity.id] }
      end
    end
  end
end
