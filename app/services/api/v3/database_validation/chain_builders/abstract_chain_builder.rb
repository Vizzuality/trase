# @abstract
# Superclass for builders of chains of database checks
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class AbstractChainBuilder
          # @param object the object to validate
          # @param errors_list [Api::V3::DatabaseValidation::ErrorsList]
          def initialize(object, errors_list)
            @object = object
            @errors_list = errors_list
          end

          # For each registered check it instantiates it, passing
          # the object and other parameters
          # @returns chain of checks to be run
          def chain
            tmp = []
            add_registered_validations_to_chain(tmp)
            add_model_validations_to_chain(tmp)
            tmp
          end

          # Registers validation to be run for the object
          def self.checks(validation, options = {})
            @validations ||= []
            @validations << {validation: validation, options: options}
          end

          private

          def add_model_validations_to_chain(chain)
            chain << Api::V3::DatabaseValidation::Checks::ActiveRecordCheck.new(@object)
          end

          def add_registered_validations_to_chain(chain)
            self.class.instance_variable_get('@validations').each do |validation|
              validation_class = Api::V3::DatabaseValidation::Checks.const_get(
                validation[:validation].to_s.camelize
              )
              chain << validation_class.new(@object, validation[:options])
            end
          end
        end
      end
    end
  end
end
