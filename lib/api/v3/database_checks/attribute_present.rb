# Checks the presence of attribute.
module Api
  module V3
    module DatabaseChecks
      class AttributePresent < GenericCheck
        # @param (see GenericCheck#initialize)
        # @option options (see GenericCheck#initialize)
        # @option options [symbol] :attribute name of attribute
        #   e.g. +:tooltip_text+
        def initialize(object, options)
          super(object, options)
          @attribute = options[:attribute]
        end

        # @return (see GenericCheck#passing?)
        def passing?
          @object.send(@attribute).present?
        end

        private

        def error
          super.merge(
            message: "#{@attribute} empty",
            suggestion: 'Please set it at :link'
          )
        end
      end
    end
  end
end
