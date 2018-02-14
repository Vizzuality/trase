module Api
  module V3
    module DatabaseChecks
      class HasManyAssociationAny < GenericCheck
        def initialize(object, options)
          super(object, options)
          @association = options[:association]
          @conditions = options[:conditions]
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
          super.merge({
            message: "#{@association} missing #{@conditions}",
            suggestion: "Please create some at :link"
          })
        end
      end
    end
  end
end
