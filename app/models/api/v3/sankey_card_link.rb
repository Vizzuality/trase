# == Schema Information
#
# Table name: sankey_card_links
#
#  id           :bigint(8)        not null, primary key
#  host         :text             not null
#  query_params :json             not null
#  title        :text             not null
#  subtitle     :text
#

module Api
  module V3
    class SankeyCardLink < YellowTable
      attr_accessor :link_param

      VALID_QUERY_PARAMS =%w[
        commodity_id
        country_id
        nodes_ids
        cont_attribute_id
        ncont_attribute_id
        start_year
        end_year
      ]

      scope :link_contains, ->(link) {
        where("host LIKE '%#{link}%' OR
               query_params->>'#{link}' IS NOT NULL OR
               query_params->>'commodity_id' LIKE '%#{link}%' OR
               query_params->>'country_id' LIKE '%#{link}%' OR
               query_params->>'nodes_ids' LIKE '%#{link}%' OR
               query_params->>'cont_attribute_id' LIKE '%#{link}%' OR
               query_params->>'ncont_attribute_id' LIKE '%#{link}%' OR
               query_params->>'start_year' LIKE '%#{link}%' OR
               query_params->>'end_year' LIKE '%#{link}%'"
        )
      }

      validates :host, presence: true
      validates :query_params, presence: true
      validates :title, presence: true

      validate :check_valid_query_params

      before_validation :extract_link_params

      def link
        return '' unless self.host && self.query_params

        "http://#{self.host}?#{self.query_params&.to_query}"
      end

      private

      def extract_link_params
        return unless link_param

        uri = URI.parse link_param
        self.host = uri.host

        ary = URI.decode_www_form(uri.query).to_h
        self.query_params = ary
      end

      def check_valid_query_params
        return unless ((query_params || {}).keys - VALID_QUERY_PARAMS).any?

        errors.add(:query_params, 'includes invalid parameters')
      end
    end
  end
end
