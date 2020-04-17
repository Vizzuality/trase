module Api
  module V3
    module CountriesComTradeIndicators
      class ComTradeRequest
        class ComTradeError < StandardError; end

        RG_TO_ACTIVITY = {
          1 => 'importer',
          2 => 'exporter'
        }

        def initialize(uri)
          @uri = URI(uri)
        end

        def call
          response = Net::HTTP.get_response(@uri)
          if response.code != '200'
            error = ComTradeError.new(response)
            Rails.logger.error error
            Appsignal.send_error(error)
            return
          end
          body = response.body
          data = JSON.parse(body)
          ensure_valid_response(data['validation']) or return

          data['dataset'].each do |element|
            Api::V3::CountriesComTradeIndicator.create(
              parse_attributes(element)
            )
          end
        end

        private

        def ensure_valid_response(validation)
          status = validation['status']
          if status['name'] != 'Ok'
            error = ComTradeError.new(
              validation['message'] + ' (' +
              status['name'] + ' ' +
              status['description'] + ')'
            )
            Rails.logger.error error
            Appsignal.send_error(error)
            return false
          end
          true
        end

        def parse_attributes(element)
          commodity_code = element['cmdCode']
          commodity = commodity_codes.lookup_by_com_trade_code(commodity_code)
          unless commodity
            error = ComTradeError.new(
              "Unknown commodity #{commodity_code}" +
               element.inspect
            )
            Rails.logger.error error
            Appsignal.send_error(error)
            return nil
          end

          iso3 = element['rt3ISO']
          return nil if iso3.blank? # e.g. country groupings

          country = country_codes.lookup_by_iso3(iso3)
          unless country
            error = ComTradeError.new(
              "Unknown country #{iso3}" +
               element.inspect
            )
            Rails.logger.error error
            Appsignal.send_error(error)
            return nil
          end

          raw_quantity = element['TradeQuantity']
          eq_factor = commodity[:eq_factor] || 1
          quantity = raw_quantity && raw_quantity * eq_factor
          activity = RG_TO_ACTIVITY[element['rgCode']]
          return nil if activity.nil? # e.g. re-export / re-import

          {
            raw_quantity: raw_quantity,
            quantity: quantity,
            value: element['TradeValue'],
            commodity_id: commodity[:trase_id],
            year: element['yr'],
            iso3: iso3,
            iso2: country[:iso2],
            commodity_code: commodity_code,
            activity: activity
          }
        end

        def commodity_codes
          return @commodity_codes if defined? @commodity_codes

          @commodity_codes =
            Api::V3::CountriesComTradeIndicators::CommodityCodes.instance
        end

        def country_codes
          return @country_codes if defined? @country_codes

          @country_codes =
            Api::V3::CountriesComTradeIndicators::CountryCodes.instance
        end
      end
    end
  end
end

# {"pfCode"=>"H2",
#  "yr"=>2013,
#  "period"=>2013,
#  "periodDesc"=>"2013",
#  "aggrLevel"=>6,
#  "IsLeaf"=>1,
#  "rgCode"=>1,
#  "rgDesc"=>"Import",
#  "rtCode"=>296,
#  "rtTitle"=>"Kiribati",
#  "rt3ISO"=>"KIR",
#  "ptCode"=>0,
#  "ptTitle"=>"World",
#  "pt3ISO"=>"WLD",
#  "ptCode2"=>nil,
#  "ptTitle2"=>"",
#  "pt3ISO2"=>"",
#  "cstCode"=>"",
#  "cstDesc"=>"",
#  "motCode"=>"",
#  "motDesc"=>"",
#  "cmdCode"=>"180610",
#  "cmdDescE"=>"Cocoa powder, cont. added sugar/oth. sweetening matter",
#  "qtCode"=>8,
#  "qtDesc"=>"Weight in kilograms",
#  "qtAltCode"=>nil,
#  "qtAltDesc"=>"",
#  "TradeQuantity"=>1608,
#  "AltQuantity"=>nil,
#  "NetWeight"=>1608,
#  "GrossWeight"=>nil,
#  "TradeValue"=>7871,
#  "CIFValue"=>nil,
#  "FOBValue"=>nil,
#  "estCode"=>0}