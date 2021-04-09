module Api
  module V3
    module CountriesComTradeIndicators
      class PartnerRequest < WorldRequest
        class ComTradeError < StandardError; end

        private

        def save(attributes)
          Api::V3::CountriesComTradePartnerIndicator.create!(
            attributes.merge(updated_at: Time.now)
          )
        end

        def parse_attributes(element)
          result = super(element)
          partner_iso3 = element['pt3ISO']
          return nil if partner_iso3.blank? || partner_iso3 == 'WLD' # ignore, e.g. country groupings

          partner_country = country_codes.lookup_by_iso3(partner_iso3)
          unless partner_country
            error = ComTradeError.new(
              "Unknown country #{partner_iso3}" +
               element.inspect
            )
            Rails.logger.error error
            Appsignal.send_error(error)
            return nil
          end
          result.merge(partner_iso3: partner_iso3, partner_iso2: partner_country[:iso2])
        end
      end
    end
  end
end
