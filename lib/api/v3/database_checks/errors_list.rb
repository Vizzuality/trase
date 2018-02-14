module Api
  module V3
    module DatabaseChecks
      class ErrorsList
        def initialize
          @errors = []
        end

        def add(options)
          @errors << options # TODO:
        end

        def error_count
          @errors.count
        end
      end
    end
  end
end
