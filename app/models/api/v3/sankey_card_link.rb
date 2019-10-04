# == Schema Information
#
# Table name: sankey_card_links
#
#  id                 :bigint(8)        not null, primary key
#  host               :text             not null
#  query_params       :json             not null
#  title              :text             not null
#  subtitle           :text
#  commodity_id       :bigint(8)
#  country_id         :bigint(8)
#  cont_attribute_id  :bigint(8)
#  ncont_attribute_id :bigint(8)
#  start_year         :integer          not null
#  end_year           :integer          not null
#  biome_id           :bigint(8)
#  level              :integer          not null
#
# Indexes
#
#  index_sankey_card_links_on_biome_id            (biome_id)
#  index_sankey_card_links_on_commodity_id        (commodity_id)
#  index_sankey_card_links_on_cont_attribute_id   (cont_attribute_id)
#  index_sankey_card_links_on_country_id          (country_id)
#  index_sankey_card_links_on_ncont_attribute_id  (ncont_attribute_id)
#
# Foreign Keys
#
#  fk_rails_...  (biome_id => nodes.id)
#  fk_rails_...  (commodity_id => commodities.id)
#  fk_rails_...  (cont_attribute_id => attributes.id)
#  fk_rails_...  (country_id => countries.id)
#  fk_rails_...  (ncont_attribute_id => attributes.id)
#

module Api
  module V3
    class SankeyCardLink < YellowTable
      attr_accessor :link_param

      MAX_PER_LEVEL = 4
      VALID_QUERY_PARAMS = {
        'selectedCountryId' => :selected_country_id,
        'selectedCommodityId' => :selected_commodity_id,
        'selectedContextId' => :selected_context_id,
        'selectedResizeBy' => :selected_resize_by,
        'selectedRecolorBy' => :selected_recolor_by,
        'selectedYears' => :selected_years,
        'selectedColumnsIds' => :selected_columns_ids,
        'selectedNodesIds' => :selected_nodes_ids,
        'selectedBiomeFilterName' => :selected_biome_filter_name
      }.freeze

      belongs_to :commodity
      belongs_to :country
      belongs_to :cont_attribute,
                 class_name: 'Api::V3::Readonly::Attribute',
                 foreign_key: 'cont_attribute_id',
                 inverse_of: :cont_attribute_sankey_card_links,
                 dependent: :destroy
      belongs_to :ncont_attribute,
                 class_name: 'Api::V3::Readonly::Attribute',
                 foreign_key: 'ncont_attribute_id',
                 inverse_of: :ncont_attribute_sankey_card_links,
                 dependent: :destroy,
                 optional: true
      belongs_to :biome,
                 class_name: 'Api::V3::Node',
                 foreign_key: 'biome_id',
                 inverse_of: :sankey_card_links,
                 optional: true
      has_many :sankey_card_link_nodes
      has_many :nodes,
               class_name: 'Api::V3::SankeyCardLinkNode',
               through: :sankey_card_link_nodes
      has_many :sankey_card_link_node_types
      has_many :node_types,
               class_name: 'Api::V3::NodeType',
               through: :sankey_card_link_node_types

      validates :host, presence: true
      validates :title, presence: true
      validates :level, presence: true, inclusion: {in: 1..3}

      validate :validate_max_links_per_level

      before_validation :extract_link_params
      before_validation :extract_relations
      after_commit :add_nodes_relations
      after_commit :add_node_types_relations

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity},
          {name: :country_id, table_class: Api::V3::Country},
          {name: :biome_id, table_class: Api::V3::Node}
        ]
      end

      def link
        return '' unless host && query_params

        "http://#{host}?#{query_params&.to_query}"
      end

      private

      def extract_link_params
        return unless link_param

        uri = URI.parse link_param
        self.host = uri.host
        self.query_params =
          uri.query ? Rack::Utils.parse_nested_query(uri.query) : {}
      end

      def extract_relations
        query_params =
          VALID_QUERY_PARAMS.except('selectedColumnsIds', 'selectedNodesIds')
        query_params.each do |uri_query_param, query_param|
          send("extract_#{query_param}") if query_params[uri_query_param]
        end
      end

      def extract_selected_country_id
        self.country_id =
          query_params['selectedCountryId'] ||
          Api::V3::Country.where(name: 'BRAZIL').first&.id
      end

      def extract_selected_commodity_id
        self.commodity_id =
          query_params['selectedCommodityId'] ||
          Api::V3::Commodity.where(name: 'SOY').first&.id
      end

      def extract_selected_context_id
        return unless query_params['selectedContextId']

        context = Api::V3::Context.find(query_params['selectedContextId'])
        self.country_id = context&.country_id
        self.commodity_id = context&.commodity_id
      end

      def extract_selected_resize_by
        self.cont_attribute_id =
          query_params['selectedResizeBy'] ||
          Api::V3::Readonly::Attribute.where(
            original_type: 'Quant', name: 'Volume'
          ).first&.id
      end

      def extract_selected_recolor_by
        return unless query_params['selectedRecolorBy']

        self.ncont_attribute_id = query_params['selectedRecolorBy']
      end

      def extract_selected_years
        years = query_params['selectedYears'] || [2017, 2017]
        if years.size > 1
          self.start_year, self.end_year = years
        else
          self.start_year = self.end_year = years.first
        end
      end

      def extract_selected_biome_filter_name
        return unless query_params['selectedBiomeFilterName']

        self.biome = Api::V3::Node.find_by(
          name: query_params['selectedBiomeFilterName']
        )
      end

      def add_nodes_relations
        if query_params['selectedNodesIds']
          nodes_ids = query_params['selectedNodesIds']
          nodes_ids.each do |node_id|
            Api::V3::SankeyCardLinkNode.find_or_create_by!(
              node_id: node_id,
              sankey_card_link_id: id
            )
          end

          # Remove old sankey card link nodes relations
          remove_old_sankey_card_link_nodes_relations(nodes_ids)
        else
          remove_old_sankey_card_link_nodes_relations([])
        end
      end

      def remove_old_sankey_card_link_nodes_relations(nodes_ids)
        if nodes_ids.any?
          Api::V3::SankeyCardLinkNode.
            where(sankey_card_link_id: id).
            where.not(node_id: nodes_ids).
            destroy_all
        else
          Api::V3::SankeyCardLinkNode.
            where(sankey_card_link_id: id).
            destroy_all
        end
      end

      def add_node_types_relations
        context_id = Api::V3::Context.
          find_by(commodity_id: commodity_id, country_id: country_id)
        columns = (query_params['selectedColumnsIds'] || '').split('-')
        columns = Hash[*columns.map { |c| c.split('_') }.flatten]
        [0, 1, 2, 3].each do |column_group|
          node_type_id = columns[column_group] ||
            get_default_node_type(context_id, column_group)

          context_node_type_property_id = get_context_node_type_property_id(
            context_id, node_type_id, column_group
          )

          Api::V3::SankeyCardLinkNodeType.find_or_initialize_by(
            column_group: column_group,
            sankey_card_link_id: id,
            context_node_type_property_id: context_node_type_property_id
          ).update!(node_type_id: node_type_id)
        end
      end

      def get_default_node_type(context_id, column_group)
        Api::V3::ContextNodeType.
          select('node_type_id').
          joins('JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id').
          find_by(
            'context_node_types.context_id': context_id,
            'context_node_type_properties.column_group': column_group,
            'context_node_type_properties.is_default': true
          )&.node_type_id
      end

      def get_context_node_type_property_id(context_id, node_type_id, column_group)
        Api::V3::NodeType.
          select('context_node_type_properties.id AS context_node_type_property_id').
          joins('JOIN context_node_types ON context_node_types.node_type_id = node_types.id').
          joins('JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id').
          find_by(
            'node_types.id': node_type_id,
            'context_node_types.context_id': context_id,
            'context_node_type_properties.column_group': column_group
          )&.context_node_type_property_id
      end

      def validate_max_links_per_level
        return unless level

        [1, 2, 3].each do |n|
          next unless send("level#{n}_max_sankey_card_links?")

          message = "cannot be more than #{MAX_PER_LEVEL} sankey card links "\
                    "for level #{n}"
          errors.add(:level, message)
        end
      end

      def level1_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(level: 1).size >= MAX_PER_LEVEL
      end

      def level2_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      level: 2).size >= MAX_PER_LEVEL
      end

      def level3_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      country_id: country_id,
                                      level: 3).size >= MAX_PER_LEVEL
      end
    end
  end
end
