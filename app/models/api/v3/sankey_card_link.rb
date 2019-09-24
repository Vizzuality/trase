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
#
# Indexes
#
#  index_sankey_card_links_on_commodity_id        (commodity_id)
#  index_sankey_card_links_on_cont_attribute_id   (cont_attribute_id)
#  index_sankey_card_links_on_country_id          (country_id)
#  index_sankey_card_links_on_ncont_attribute_id  (ncont_attribute_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id)
#  fk_rails_...  (cont_attribute_id => attributes.id)
#  fk_rails_...  (country_id => countries.id)
#  fk_rails_...  (ncont_attribute_id => attributes.id)
#

module Api
  module V3
    class SankeyCardLink < YellowTable
      attr_accessor :link_param

      VALID_QUERY_PARAMS = %w[
        commodity_id
        country_id
        nodes_ids
        cont_attribute_id
        ncont_attribute_id
        start_year
        end_year
      ]

      REQUIRED_QUERY_PARAMS = %w[
        commodity_id
        country_id
        cont_attribute_id
        ncont_attribute_id
      ]

      scope :link_contains, ->(link) {
        where("host LIKE '%#{link}%' OR
               query_params->>'#{link}' IS NOT NULL OR
               commodity_id = '%#{link}%' OR
               country_id = '%#{link}%' OR
               cont_attribute_id = '%#{link}%' OR
               ncont_attribute_id = '%#{link}%' OR
               query_params->>'nodes_ids' LIKE '%#{link}%' OR
               query_params->>'start_year' LIKE '%#{link}%' OR
               query_params->>'end_year' LIKE '%#{link}%'"
        )
      }

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
        dependent: :destroy
      has_many :sankey_card_link_nodes
      has_many :nodes,
        class_name: 'Api::V3::SankeyCardLinkNode',
        through: :sankey_card_link_nodes

      validates :host, presence: true
      validates :query_params, presence: true
      validates :title, presence: true

      validate :check_valid_query_params

      before_validation :extract_link_params
      before_validation :extract_required_params
      after_commit :add_nodes_relations

      def link
        return '' unless self.host && self.query_params

        "http://#{self.host}?#{self.query_params&.to_query}"
      end

      def self.ransackable_scopes(*)
        %i(link_contains)
      end

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity},
          {name: :country_id, table_class: Api::V3::Country},
          {name: :cont_attribute_id, table_class: Api::V3::Readonly::Attribute},
          {name: :ncont_attribute_id, table_class: Api::V3::Readonly::Attribute}
        ]
      end

      private

      def extract_link_params
        return unless link_param
        uri = URI.parse link_param
        self.host = uri.host

        return unless uri.query
        ary = URI.decode_www_form(uri.query).to_h
        self.query_params = ary
      end

      def extract_required_params
        return unless self.query_params

        REQUIRED_QUERY_PARAMS.each do |required_parameter|
          self.send("#{required_parameter}=", self.query_params[required_parameter])
        end
      end

      def add_nodes_relations
        nodes_ids = self.query_params['nodes_ids'].split(',')
        nodes_ids.each do |node_id|
          Api::V3::SankeyCardLinkNode.find_or_create_by!(
            node_id: node_id,
            sankey_card_link_id: self.id
          )
        end

        # Remove old sankey card link nodes relations
        Api::V3::SankeyCardLinkNode.
          where(sankey_card_link_id: self.id).
          where.not(node_id: nodes_ids).
          destroy_all
      end

      def check_valid_query_params
        # Check if we are indicating only permitted params
        if ((query_params || {}).keys - VALID_QUERY_PARAMS).any?
          errors.add(:link_param, 'includes invalid parameters')
        end

        # Check if we are including all obligatory params
        if (REQUIRED_QUERY_PARAMS - (query_params || {}).keys).any?
          errors.add(
            :link_param,
            'must specify commodity, country, cont_attribute and ncont_attribute'
          )
        end
      end
    end
  end
end
