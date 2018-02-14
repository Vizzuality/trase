module Api
  module V3
    module DatabaseChecks
      class HasOneAssociationPresent
        def initialize(object, options)
          @object = object
          @association = options[:association]
          @link = options[:link]
        end

        def call(report_status)
          return if passing?
          report_status.add_error(error)
        end

        def passing?
          @object.send(@association).present?
        end

        private

        def error
          {
            object: @object,
            type: self.class.name,
            message: "#{@association} missing",
            suggestion: "Please create one at :link",
            link: @link
          }
        end
      end
    end
  end
end
