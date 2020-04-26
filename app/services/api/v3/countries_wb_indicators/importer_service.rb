require 'json'

module Api
  module V3
    module CountriesWbIndicators
      class ImporterService
        def self.call
          start_year = Api::V3::Flow.minimum(:year)
          end_year = Api::V3::Flow.maximum(:year)
          indicators = IndicatorsList::ATTRIBUTES.values
          Rails.logger.debug("Scheduling #{indicators.length} WB requests")
          indicators.each do |indicator|
            indicator_name = indicator[:wb_name]
            Rails.logger.debug("Scheduling #{indicator_name} WB request")
            WbRequestWorker.perform_async(indicator_name, start_year, end_year)
          end
        end
      end
    end
  end
end
