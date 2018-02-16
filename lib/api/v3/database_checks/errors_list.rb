module Api
  module V3
    module DatabaseChecks
      class ErrorsList
        def initialize
          @errors = []
        end

        def add(options)
          @errors << options
        end

        def error_count
          @errors.count
        end

        def empty?
          error_count.zero?
        end
      end
    end
  end
end
