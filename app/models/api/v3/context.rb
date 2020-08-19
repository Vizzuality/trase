# == Schema Information
#
# Table name: contexts
#
#  id                                                                                   :integer          not null, primary key
#  country_id                                                                           :integer          not null
#  commodity_id                                                                         :integer          not null
#  years(Years for which country-commodity data is present; empty (NULL) for all years) :integer          is an Array
#  default_year(Default year for this context)                                          :integer
#  subnational_years                                                                    :integer          is an Array
#
# Indexes
#
#  contexts_commodity_id_idx             (commodity_id)
#  contexts_country_id_commodity_id_key  (country_id,commodity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class Context < BlueTable
      belongs_to :country
      belongs_to :commodity
      has_one :context_property
      has_many :recolor_by_attributes
      has_many :resize_by_attributes
      has_many :contextual_layers
      has_many :context_node_types
      has_many :profiles, through: :context_node_types
      has_many :dashboards_attributes
      has_many :download_attributes
      has_many :map_attribute_groups
      has_many :map_attributes, through: :map_attribute_groups
      has_many :flows
      has_many :top_profiles

      has_many :ind_context_properties
      has_many :quant_context_properties
      has_many :qual_context_properties

      has_many :nodes_stats

      has_one :readonly_context,
              class_name: 'Api::V3::Readonly::Context',
              foreign_key: :id

      delegate :is_default, to: :context_property
      delegate :is_disabled, to: :context_property
      delegate :is_highlighted, to: :context_property
      delegate :default_basemap, to: :context_property

      validates :country, presence: true
      validates :commodity, presence: true, uniqueness: {scope: :country}

      def self.select_options
        Api::V3::Context.includes(:country, :commodity).order(
          'countries.name, commodities.name'
        ).all.map do |ctx|
          [[ctx.country&.name, ctx.commodity&.name].join(' / '), ctx.id]
        end
      end

      def self.import_key
        [
          {name: :country_id, sql_type: 'INT'},
          {name: :commodity_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end

      def is_subnational
        subnational_years && subnational_years.any?
      end
    end
  end
end
