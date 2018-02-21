# Checks the presence of attribute.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class ActiveRecordCheck < AbstractCheck
          # Calls {#passing?} and saves error when it fails
          # @param errors_list [Api::V3::DatabaseValidation::ErrorsList]
          def call(errors_list)
            return if passing?
            @object.errors.full_messages.each do |message|
              errors_list.add(
                object: @object, message: message, severity: :error
              )
            end
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            @object.valid?
          end
        end
      end
    end
  end
end
