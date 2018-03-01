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

      delegate :is_default, to: :context_property
      delegate :is_disabled, to: :context_property
      delegate :is_subnational, to: :context_property
      delegate :default_basemap, to: :context_property

      validates :country, presence: true
      validates :commodity, presence: true, uniqueness: {scope: :country}

      def visible?
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
