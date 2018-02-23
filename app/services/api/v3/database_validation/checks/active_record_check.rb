# Checks the presence of attribute.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class ActiveRecordCheck < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :on name of the linked object to validate
          #   is defined, e.g. +ind_property+
          def initialize(object, options = {})
            super(object, options)
            initialize_on_object(options)
            @validated_object = @on_object || @object
          end

          # Calls {#passing?} and saves error when it fails
          # @param errors_list [Api::V3::DatabaseValidation::ErrorsList]
          def call(errors_list)
            return if passing?
            @validated_object.errors.full_messages.each do |message|
              errors_list.add(
                error.merge(
                  object: @validated_object, message: message
                )
              )
            end
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            @validated_object.valid?
          end
        end
      end
    end
  end
end
