# Checks the presence of attribute.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class AttributePresent < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :attribute name of attribute
          #   e.g. +:tooltip_text+
          # @option options [symbol] :on name of the object on which attribute
          #   is defined, e.g. +ind_property+
          def initialize(object, options)
            super(object, options)
            @attribute = options[:attribute]
            initialize_on_object(options)
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            return true unless @on_object.present?
            @on_object.send(@attribute).present?
          end

          private

          def error
            super.merge(
              message: "#{@attribute} empty"
            )
          end
        end
      end
    end
  end
end
