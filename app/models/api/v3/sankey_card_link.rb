# == Schema Information
#
# Table name: sankey_card_links
#
#  id                                                                       :bigint(8)        not null, primary key
#  host                                                                     :text             not null
#  query_params(query params included on the link of the quick sankey card) :json             not null
#  title(title of the quick sankey card)                                    :text             not null
#  subtitle(subtitle of the quick sankey card)                              :text
#  start_year                                                               :integer          not null
#  end_year                                                                 :integer          not null
#  node_id                                                                  :bigint(8)
#  level1(level used when commodity and country are not selected)           :boolean          default(FALSE), not null
#  level2(level used when commodity is selected)                            :boolean          default(FALSE), not null
#  level3(level used when commodity and country are selected)               :boolean          default(FALSE), not null
#  country_id                                                               :bigint(8)
#  commodity_id                                                             :bigint(8)
#  cont_attribute_id                                                        :bigint(8)
#  ncont_attribute_id                                                       :bigint(8)
#
# Indexes
#
#  index_sankey_card_links_on_commodity_id        (commodity_id)
#  index_sankey_card_links_on_cont_attribute_id   (cont_attribute_id)
#  index_sankey_card_links_on_country_id          (country_id)
#  index_sankey_card_links_on_ncont_attribute_id  (ncont_attribute_id)
#  index_sankey_card_links_on_node_id             (node_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade
#  fk_rails_...  (cont_attribute_id => attributes.id) ON DELETE => cascade
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade
#  fk_rails_...  (ncont_attribute_id => attributes.id) ON DELETE => cascade
#  fk_rails_...  (node_id => nodes.id)
#

module Api
  module V3
    class SankeyCardLink < YellowTable
      attr_accessor :link_param

      MAX_PER_LEVEL = 4
      LEVELS = [1, 2, 3].freeze
      VALID_QUERY_PARAMS = {
        'selectedCountryId' => :selected_country_id,
        'selectedCommodityId' => :selected_commodity_id,
        'selectedContextId' => :selected_context_id,
        'selectedResizeBy' => :selected_resize_by,
        'selectedRecolorBy' => :selected_recolor_by,
        'selectedYears' => :selected_years,
        'selectedColumnsIds' => :selected_columns_ids,
        'selectedNodesIds' => :selected_nodes_ids,
        'extraColumnNodeId' => :extra_column_node_id
      }.freeze

      belongs_to :commodity
      belongs_to :country
      belongs_to :cont_attribute,
                 class_name: 'Api::V3::Readonly::Attribute',
                 foreign_key: 'cont_attribute_id',
                 inverse_of: :cont_attribute_sankey_card_links
      belongs_to :ncont_attribute,
                 class_name: 'Api::V3::Readonly::Attribute',
                 foreign_key: 'ncont_attribute_id',
                 inverse_of: :ncont_attribute_sankey_card_links,
                 optional: true
      belongs_to :node,
                 class_name: 'Api::V3::Node',
                 foreign_key: 'node_id',
                 inverse_of: :sankey_card_links,
                 optional: true
      has_many :sankey_card_link_nodes, dependent: :destroy
      has_many :nodes,
               class_name: 'Api::V3::SankeyCardLinkNode',
               through: :sankey_card_link_nodes
      has_many :sankey_card_link_node_types, dependent: :destroy
      has_many :node_types,
               class_name: 'Api::V3::NodeType',
               through: :sankey_card_link_node_types

      validates :host, presence: true
      validates :title, presence: true
      validates :level1, presence: true, if: -> { !level2 && !level3 }
      validates :level2, presence: true, if: -> { !level1 && !level3 }
      validates :level3, presence: true, if: -> { !level1 && !level2 }

      validate :validate_max_links_per_level

      before_validation :extract_link_params
      before_validation :extract_relations, if: :will_save_change_to_query_params?
      before_save  :update_query_params
      after_commit :add_nodes_relations, if: :persisted?
      after_commit :add_node_types_relations, if: :persisted?

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity},
          {name: :country_id, table_class: Api::V3::Country},
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end

      def link
        return '' unless host && query_params

        "http://#{host}?#{query_params.to_query}"
      end

      private

      def validate_max_links_per_level
        LEVELS.each do |n|
          next if !send("level#{n}") ||
            !will_save_change_to_attribute?("level#{n}") ||
            !send("level#{n}_max_sankey_card_links?")

          message = "cannot be more than #{MAX_PER_LEVEL} sankey card links "\
                    "for level#{n}"
          errors.add(:"level#{n}", message)
        end
      end

      def level1_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(level1: true).size >= MAX_PER_LEVEL
      end

      def level2_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      level2: true).size >= MAX_PER_LEVEL
      end

      def level3_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      country_id: country_id,
                                      level3: true).size >= MAX_PER_LEVEL
      end

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

        return unless self.query_params['selectedNodesIds']
        self.query_params['selectedNodesIds'] =
          self.query_params['selectedNodesIds'].map(&:to_i)
      end

      def extract_selected_country_id
        self.country_id =
          query_params['selectedCountryId'] ||
          Api::V3::Country.find_by(name: 'BRAZIL')&.id
      end

      def extract_selected_commodity_id
        self.commodity_id =
          query_params['selectedCommodityId'] ||
          Api::V3::Commodity.find_by(name: 'SOY')&.id
      end

      def extract_selected_context_id
        return unless query_params['selectedContextId']

        context = Api::V3::Context.find(query_params['selectedContextId'])
        self.country_id = context.country_id
        self.commodity_id = context.commodity_id
      end

      def extract_selected_resize_by
        self.cont_attribute_id =
          query_params['selectedResizeBy'] ||
          Api::V3::Readonly::Attribute.find_by(
            original_type: 'Quant', name: 'Volume'
          )&.id
      end

      def extract_selected_recolor_by
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

      def extract_extra_column_node_id
        self.node = Api::V3::Node.find_by(
          id: query_params['extraColumnNodeId']
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
          find_by(commodity_id: commodity_id, country_id: country_id)&.id
        columns = (query_params['selectedColumnsIds'] || '').split('-')
        columns = Hash[*columns.map { |c| c.split('_').map(&:to_i) }.flatten]
        [0, 1, 2, 3].each do |column_group|
          node_type_id = columns[column_group] ||
            get_default_node_type(context_id, column_group)
          context_node_type_property_id = get_context_node_type_property_id(
            context_id, node_type_id, column_group
          )
          next unless node_type_id && context_node_type_property_id

          Api::V3::SankeyCardLinkNodeType.find_or_initialize_by(
            column_group: column_group,
            sankey_card_link_id: id
          ).update!(
            node_type_id: node_type_id,
            context_node_type_property_id: context_node_type_property_id
          )
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

      def update_query_params
        if query_params['selectedCountryId'] != country_id
          query_params['selectedCountryId'] = country_id
        end

        if query_params['selectedCommodityId'] != commodity_id
          query_params['selectedCommodityId'] = commodity_id
        end

        if query_params['selectedResizeBy'] != cont_attribute_id
          query_params['selectedResizeBy'] = cont_attribute_id
        end

        if query_params['selectedRecolorBy'] != ncont_attribute_id
          query_params['selectedRecolorBy'] = ncont_attribute_id
        end

        return if query_params['extraColumnNodeId'] == node&.id
        query_params['extraColumnNodeId'] = node&.id
      end
    end
  end
end
