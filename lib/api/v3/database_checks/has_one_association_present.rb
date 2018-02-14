module Api
  module V3
    module DatabaseChecks
      class HasOneAssociationPresent < GenericCheck
        def initialize(object, options)
          super(object, options)
          @association = options[:association]
        end

        def passing?
          @object.send(@association).present?
        end

        private

        def error
          super.merge({
            message: "#{@association} missing",
            suggestion: "Please create one at :link"
          })
        end
      end
    end
  end
end
