# Stores mapping between Trase and ComTrade commodity codes.
module Api
  module V3
    module CountriesComTradeIndicators
      class CommodityCodes
        DATA_FILE_PATH = "db/commodity_codes.csv".freeze
        COMMODITY_COLUMN = "parent_commodity".freeze
        COM_TRADE_CODES_COLUMN = "hs6_codes".freeze
        EQ_FACTOR_COLUMN = "eq_factor".freeze
        WORLD = "WORLD".freeze

        def initialize
          load_data
        end

        # @param code [String] HS6 code
        def lookup_by_com_trade_code(code)
          unless defined? @lookup_by_com_trade_code
            initialize_lookup_by_com_trade_code
          end
          @data[@lookup_by_com_trade_code[code]]
        end

        # @param name [Integer] id
        def lookup_by_trase_id(id)
          unless defined? @lookup_by_trase_id
            initialize_lookup_by_trase_id
          end
          idxs = @lookup_by_trase_id[id]
          idxs && idxs.map { |idx| @data[idx] }
        end

        private

        def load_data
          csv = CSV.read(DATA_FILE_PATH, headers: true)
          commodity_column = csv.headers.index(COMMODITY_COLUMN)
          codes_column = csv.headers.index(COM_TRADE_CODES_COLUMN)
          eq_factor_column = csv.headers.index(EQ_FACTOR_COLUMN)
          @data = csv.map do |row|
            codes_str = row[codes_column]
            next if codes_str.blank?

            trase_name = row[commodity_column]
            {
              com_trade_codes: codes_str.sub(/\{/, "").sub(/\}/, "").split(","),
              trase_name: trase_name,
              trase_id: commodities[trase_name],
              eq_factor: row[eq_factor_column]&.to_f
            }
          end.compact
        end

        def initialize_lookup_by_com_trade_code
          @lookup_by_com_trade_code = {}
          @data.each.with_index do |commodity, idx|
            commodity[:com_trade_codes].each do |code|
              @lookup_by_com_trade_code[code] = idx
            end
          end
        end

        def initialize_lookup_by_trase_id
          @lookup_by_trase_id = {}
          @data.each.with_index do |commodity, idx|
            @lookup_by_trase_id[commodity[:trase_id]] ||= []
            @lookup_by_trase_id[commodity[:trase_id]] << idx
          end
        end

        def commodities
          return @commodities if defined? @commodities

          initialize_commodities
        end

        def initialize_commodities
          @commodities = Hash[
            Api::V3::Commodity.all.pluck(:name, :id)
          ]
        end
      end
    end
  end
end
