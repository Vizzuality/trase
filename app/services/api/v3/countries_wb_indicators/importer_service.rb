require 'json'

module Api
  module V3
    module CountriesWbIndicators
      class ImporterService
        def self.call(indicator_names = Api::V3::CountriesWbIndicators::ApiService::INDICATORS.keys)
          start_year = Api::V3::Flow.minimum(:year)
          end_year = Api::V3::Flow.maximum(:year)
          Rails.logger.debug("Scheduling #{indicator_names.length} WB requests")
          indicator_names.each do |indicator_name|
            Rails.logger.debug("Scheduling #{indicator_name} WB request")
            WbRequestWorker.perform_async(indicator_name, start_year, end_year)
          end
        end
      end
    end
  end
end
