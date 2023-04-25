# Stores mapping between Trase and ComTrade country codes.
module Api
  module V3
    module CountriesComTradeIndicators
      class CountryCodes
        DATA_FILE_PATH = "db/country_codes.csv".freeze
        ISO2_COLUMN = "ISO3166-1-Alpha-2".freeze
        ISO3_COLUMN = "ISO3166-1-Alpha-3".freeze
        M49_COLUMN = "M49".freeze

        def initialize
          load_data
        end

        # @param code [String] iso2
        def lookup_by_iso2(code)
          unless defined? @lookup_by_iso2
            initialize_lookup_by_iso2
          end
          idx = @lookup_by_iso2[code]
          idx && @data[idx]
        end

        # @param code [String] iso3
        def lookup_by_iso3(code)
          unless defined? @lookup_by_iso3
            initialize_lookup_by_iso3
          end
          idx = @lookup_by_iso3[code]
          idx && @data[idx]
        end

        # @param code [Integer] m49
        def lookup_by_m49(code)
          unless defined? @lookup_by_m49
            initialize_lookup_by_m49
          end
          idx = @lookup_by_m49[code]
          idx && @data[idx]
        end

        private

        def load_data
          @data = CSV.read(DATA_FILE_PATH, headers: true)
          iso2_column = @data.headers.index(ISO2_COLUMN)
          iso3_column = @data.headers.index(ISO3_COLUMN)
          m49_column = @data.headers.index(M49_COLUMN)
          @data = @data.map do |row|
            {
              iso2: row[iso2_column],
              iso3: row[iso3_column],
              m49: row[m49_column]
            }
          end
        end

        def initialize_lookup_by_iso2
          @lookup_by_iso2 = Hash[
            @data.map.with_index { |e, idx| [e[:iso2], idx] }
          ]
        end

        def initialize_lookup_by_iso3
          @lookup_by_iso3 = Hash[
            @data.map.with_index { |e, idx| [e[:iso3], idx] }
          ]
        end

        def initialize_lookup_by_m49
          @lookup_by_m49 = Hash[
            @data.map.with_index { |e, idx| [e[:m49], idx] }
          ]
        end
      end
    end
  end
end
