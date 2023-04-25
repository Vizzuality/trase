# == Schema Information
#
# Table name: countries_com_trade_world_aggregated_indicators
#
#  quantity      :float
#  value         :float
#  quantity_rank :integer
#  value_rank    :integer
#  commodity_id  :integer
#  year          :integer
#  iso2          :text
#  activity      :text
#
module Api
  module V3
    module Readonly
      class CountriesComTradeWorldAggregatedIndicator < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = "countries_com_trade_world_aggregated_indicators"

        INDEXES = [].freeze
      end
    end
  end
end
