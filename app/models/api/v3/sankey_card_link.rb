# == Schema Information
#
# Table name: sankey_card_links
#
#  id         :bigint(8)        not null, primary key
#  link       :json             not null
#  title      :text             not null
#  subtitle   :text
#

module Api
  module V3
    class SankeyCardLink < YellowTable
      attr_accessor :link_param

      validates :host, presence: true
      validates :query_params, presence: true
      validates :title, presence: true

      before_save :extract_link_params

      def link
        "#{self.host}?#{self.query_params.to_query}"
      end

      private

      def extract_link_params
        uri = URI.parse link_param
        self.host = uri.host

        ary = URI.decode_www_form(uri.query).to_h
        self.query_params = ary
      end
    end
  end
end
