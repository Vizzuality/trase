# == Schema Information
#
# Table name: database_validation_reports
#
#  id            :integer          not null, primary key
#  report        :json             not null
#  error_count   :integer          not null
#  warning_count :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

module Api
  module V3
    class DatabaseValidationReport < BaseModel
      SUCCESS = 'SUCCESS'.freeze
      FAILED = 'FAILED'.freeze

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
