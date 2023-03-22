# == Schema Information
#
# Table name: countries_com_trade_partner_aggregated_indicators
#
#  quantity     :float
#  value        :float
#  commodity_id :integer
#  year         :integer
#  iso2         :text
#  partner_iso2 :text
#  activity     :text
#
module Api
  module V3
    module Readonly
      class CountriesComTradePartnerAggregatedIndicator < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = "countries_com_trade_partner_aggregated_indicators"

        INDEXES = [].freeze
      end
    end
  end
end
