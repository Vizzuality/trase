# == Schema Information
#
# Table name: database_validation_reports
#
#  id                                            :bigint(8)        not null, primary key
#  report(JSON structure with validation report) :json             not null
#  error_count(Count of errors detected)         :integer          not null
#  warning_count(Count of warnings detected)     :integer          not null
#
module Api
  module V3
    class DatabaseValidationReport < BaseModel
      SUCCESS = "SUCCESS".freeze
      FAILED = "FAILED".freeze

      alias_attribute :finished_at, :updated_at

      validates :report, presence: true
      validates :error_count, presence: true
      validates :warning_count, presence: true

      def status
        if error_count.zero?
          SUCCESS
        else
          FAILED
        end
      end
    end
  end
end
