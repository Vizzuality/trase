module Api
  module V3
    module CountriesComTradeIndicators
      class WorldRequest
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
            # this is to force a retry on the job
            raise error
          end
          body = response.body
          data = JSON.parse(body)
          ensure_valid_response(data['validation']) or return

          data['dataset'].each do |element|
            attributes = parse_attributes(element)
            next unless attributes

            save(attributes)
          end
        end

        private

        def save(attributes)
          Api::V3::CountriesComTradeWorldIndicator.create!(
            attributes.merge(updated_at: Time.now)
          )
        end

        # invalid status codes:
        # Query complexity (5002)
        # Result too large (5003)
        # Invalid parameter (5004)
        # There's no point retrying, must be fixed first
        def ensure_valid_response(validation)
          status = validation['status']
          return true if status['name'] == 'Ok'

          error = ComTradeError.new(
            validation['message'] + ' (' +
            status['name'] + ' ' +
            status['description'] + ')'
          )
          Rails.logger.error error
          Appsignal.send_error(error)
          return false
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
          return nil if iso3.blank? || iso3 == 'WLD' # ignore, e.g. country groupings

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
          return nil if activity.nil? # ignore, e.g. re-export / re-import

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
            Api::V3::CountriesComTradeIndicators::CommodityCodes.new
        end

        def country_codes
          return @country_codes if defined? @country_codes

          @country_codes =
            Api::V3::CountriesComTradeIndicators::CountryCodes.new
        end
      end
    end
  end
end
