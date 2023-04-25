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

          def self.human_readable_rules(parent_object_name, options)
            validated_object_class = options &&
              validated_object_class(options[:on])
            validated_object_name =
              validated_object_class&.name&.demodulize || parent_object_name

            human_readable_array(options).map do |check|
              {
                validated_object: validated_object_name,
                rule: check
              }
            end
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            @validated_object.valid?
          end

          private_class_method def self.human_readable_array(options)
            model_class = Api::V3.const_get(options[:on].to_s.camelize)
            model_class.validators.map do |validator|
              human_readable_options = validator.options.map do |k, v|
                "#{k}: #{v}"
              end
              if validator.respond_to?(:attributes)
                validated_attributes = validator.attributes.join(", ")
              end
              [
                validator.kind,
                "of",
                validated_attributes,
                human_readable_options
              ].join(" ")
            end
          end
        end
      end
    end
  end
end
