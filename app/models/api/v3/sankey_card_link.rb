# == Schema Information
#
# Table name: sankey_card_links
#
#  id                                                                       :bigint(8)        not null, primary key
#  query_params(query params included on the link of the quick sankey card) :json             not null
#  title(title of the quick sankey card)                                    :text             not null
#  subtitle(subtitle of the quick sankey card)                              :text
#  level1(level used when commodity and country are not selected)           :boolean          default(FALSE), not null
#  level2(level used when commodity is selected)                            :boolean          default(FALSE), not null
#  level3(level used when commodity and country are selected)               :boolean          default(FALSE), not null
#  country_id                                                               :bigint(8)
#  commodity_id                                                             :bigint(8)
#  link                                                                     :text
#
# Indexes
#
#  index_sankey_card_links_on_commodity_id  (commodity_id)
#  index_sankey_card_links_on_country_id    (country_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade
#
module Api
  module V3
    class SankeyCardLink < YellowTable
      MAX_PER_LEVEL = {1 => 4, 2 => 4, 3 => 3}.freeze
      LEVELS = [1, 2, 3].freeze

      belongs_to :commodity
      belongs_to :country

      validates :title, presence: true
      validates :level1, presence: true, if: -> { !level2 && !level3 }
      validates :level2, presence: true, if: -> { !level1 && !level3 }
      validates :level3, presence: true, if: -> { !level1 && !level2 }
      validates :link, presence: true, url: true

      validate :validate_max_links_per_level

      before_validation :parse_link, if: :will_save_change_to_link?

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity},
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end

      def nodes_ids
        Api::V3::SankeyCardLinks::QueryParams.instance.
          nodes_ids(query_params)
      end

      def node_types_ids
        Api::V3::SankeyCardLinks::QueryParams.instance.
          node_types_ids(query_params)
      end

      def update_query_params(query_params)
        self.query_params = query_params
        self.link = link_from_query_params
        save(validate: false)
      end

      private

      def validate_max_links_per_level
        LEVELS.each do |n|
          next if !send("level#{n}") ||
            !will_save_change_to_attribute?("level#{n}") ||
            !send("level#{n}_max_sankey_card_links?")

          message = "there cannot be more than #{MAX_PER_LEVEL[n]} sankey "\
                    "card links for level#{n}"
          errors.add(:"level#{n}", message)
        end
      end

      def level1_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(level1: true).size >= MAX_PER_LEVEL[1]
      end

      def level2_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      level2: true).size >= MAX_PER_LEVEL[2]
      end

      def level3_max_sankey_card_links?
        Api::V3::SankeyCardLink.where(commodity_id: commodity_id,
                                      country_id: country_id,
                                      level3: true).size >= MAX_PER_LEVEL[3]
      end

      def parse_link
        return unless link

        begin
          uri = URI.parse link
        rescue StandardError => error
          return false
        end

        self.query_params =
          uri.query ? Rack::Utils.parse_nested_query(uri.query) : {}

        extract_selected_country_id
        extract_selected_commodity_id

        self.query_params = Api::V3::SankeyCardLinks::QueryParams.instance.
          cleanup(query_params)

        self.link = link_from_query_params
      end

      def extract_selected_country_id
        cs_countries_ids = query_params["countries"]
        self.country_id =
          cs_countries_ids&.split(",")&.first ||
          query_params["selectedCountryId"] ||
          Api::V3::Country.find_by(name: "BRAZIL")&.id
      end

      def extract_selected_commodity_id
        cs_commodities_ids = query_params["commodities"]
        self.commodity_id =
          cs_commodities_ids&.split(",")&.first ||
          query_params["selectedCommodityId"] ||
          Api::V3::Commodity.find_by(name: "SOY")&.id
      end

      def link_from_query_params
        return nil unless link.present?

        link_without_query_params = link.split("?").first
        "#{link_without_query_params}?#{query_params.to_query}"
      end
    end
  end
end
