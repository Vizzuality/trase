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
        if error_count == 0
          SUCCESS
        else
          FAILED
        end
      end
    end
  end
end
