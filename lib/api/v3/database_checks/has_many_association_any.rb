module Api
  module V3
    module DatabaseChecks
      class HasManyAssociationAny
        def initialize(object, options)
          @object = object
          @association = options[:association]
          @conditions = options[:conditions]
          @link = options[:link]
        end

        def call(report_status)
          return if passing?
          report_status.add_error(error)
        end

        def passing?
          tmp = @object.send(@association)
          if @conditions.present? && @conditions.is_a?(Hash)
            tmp = tmp.where(@conditions)
          end
          tmp.any?
        end

        private

        def error
          {
            object: @object,
            type: self.class.name,
            message: "#{@association} missing #{@conditions}",
            suggestion: "Please create some at :link",
            link: @link
          }
        end
      end
    end
  end
end
