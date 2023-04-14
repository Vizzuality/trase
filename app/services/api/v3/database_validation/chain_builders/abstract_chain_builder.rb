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
            add_validations_to_chain(tmp)
            tmp
          end

          # Registers validation to be run for the object
          def self.checks(validation, options = {})
            @validations ||= []
            @validations << {validation: validation, options: options}
          end

          def self.human_readable_rules
            self_name = name.demodulize.sub("ChainBuilder", "").underscore.humanize
            @validations.map do |validation|
              validation_class = Api::V3::DatabaseValidation::Checks.const_get(
                validation[:validation].to_s.camelize
              )
              validation_class.human_readable_rules(self_name, validation[:options])
            end.flatten
          end

          private

          def add_validations_to_chain(chain)
            self.class.instance_variable_get("@validations").each do |validation|
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
