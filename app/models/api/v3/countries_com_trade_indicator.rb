# == Schema Information
#
# Table name: countries_com_trade_indicators
#
#  raw_quantity   :float
#  quantity       :float
#  value          :float
#  commodity_id   :integer          not null
#  year           :integer          not null
#  iso3           :text             not null
#  iso2           :text             not null
#  commodity_code :text             not null
#  activity       :text             not null
#
module Api
  module V3
    class CountriesComTradeIndicator < YellowTable
      belongs_to :commodity, optional: false

      validates :iso3, presence: true
      validates :iso2, presence: true
      validates :year, presence: true
      validates :commodity_code, presence: true
      validates :activity, presence: true

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end
    end
  end
end
