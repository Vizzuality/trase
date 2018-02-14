module Api
  module V3
    module DatabaseChecks
      class GenericCheck
        def initialize(object, options)
          @object = object
          @link = options[:link]
          @severity = options[:severity] || :error
        end

        def call(report_status)
          return if passing?
          report_status.add(error)
        end

        private

        def error
          {
            object: @object,
            type: self.class.name,
            link: @link,
            severity: @severity
          }
        end
      end
    end
  end
end
