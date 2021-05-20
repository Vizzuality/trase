require 'json'

module Api
  module V3
    module CountriesWbIndicators
      class ImporterService
        # rubocop:disable Metrics/CyclomaticComplexity
        # rubocop:disable Metrics/PerceivedComplexity
        def self.call
          # do not run in production
          return if Rails.env.production?
          # On staging, run in the first week of the month
          return if Rails.env.staging? && Date.today.day > 7
          # On sandbox, run in the second week of the month
          return if Rails.env.sandbox? && (Date.today.day > 14 || Date.today.day <= 7)
          # elsewhere run in the third week of the month
          return unless (Date.today.day > 14 && Date.today.day <= 21) || Rails.env.test? || Rails.env.development?

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
        # rubocop:enable Metrics/CyclomaticComplexity
        # rubocop:enable Metrics/PerceivedComplexity
      end
    end
  end
end
