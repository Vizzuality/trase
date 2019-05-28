# == Schema Information
#
# Table name: contexts
#
#  id                                                                                   :integer          not null, primary key
#  country_id                                                                           :integer          not null
#  commodity_id                                                                         :integer          not null
#  years(Years for which country-commodity data is present; empty (NULL) for all years) :integer          is an Array
#  default_year(Default year for this context)                                          :integer
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
      has_many :readonly_recolor_by_attributes, class_name: 'Readonly::RecolorByAttribute'
      has_many :resize_by_attributes
      has_many :readonly_resize_by_attributes, class_name: 'Readonly::ResizeByAttribute'
      has_many :contextual_layers
      has_many :context_node_types
      has_many :profiles, through: :context_node_types
      has_many :download_attributes
      has_many :map_attribute_groups
      has_many :map_attributes, through: :map_attribute_groups
      has_many :flows

      has_many :ind_context_properties
      has_many :quant_context_properties
      has_many :qual_context_properties

      delegate :is_default, to: :context_property
      delegate :is_disabled, to: :context_property
      delegate :is_subnational, to: :context_property
      delegate :is_highlighted, to: :context_property
      delegate :default_basemap, to: :context_property

      validates :country, presence: true
      validates :commodity, presence: true, uniqueness: {scope: :country}

      def is_visible?
        country.present? &&
        commodity.present? &&
        country_context_node_type.present? &&
        exporter_context_node_type.present?
      end

      def country_context_node_type
        context_node_types.find do |cnt|
          cnt.node_type.name == NodeTypeName::COUNTRY
        end
      end

      def exporter_context_node_type
        context_node_types.find do |cnt|
          cnt.node_type.name == NodeTypeName::EXPORTER
        end
      end

      def biome_nodes
        biome_context_node_type = context_node_types.
          joins(:node_type).
          find_by('node_types.name' => NodeTypeName::BIOME)
        # Brazil - soy & Paraguay - soy only
        return [] unless biome_context_node_type

        biome_idx = biome_context_node_type.column_position + 1
        Api::V3::Node.
          select([:id, :name]).
          joins(
            "JOIN (
              #{flows.select("path[#{biome_idx}] AS node_id").distinct.to_sql}
            ) s ON s.node_id = nodes.id"
          ).
          where(
            node_type_id: biome_context_node_type.node_type_id,
            is_unknown: false
          ).
          where("name NOT LIKE 'OTHER%'").
          order('nodes.name')
      end

      def self.select_options
        Api::V3::Context.includes(:country, :commodity).all.map do |ctx|
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
    end
  end
end
