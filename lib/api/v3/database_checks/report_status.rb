module Api
  module V3
    module DatabaseChecks
      class ReportStatus
        def initialize
          @errors = []
          @warnings = []
        end

        def add_error(options)
          @errors << options # TODO:
        end

        def error_count
          @errors.count
        end
      end
    end
  end
end
