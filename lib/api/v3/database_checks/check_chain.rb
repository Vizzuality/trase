# @abstract
# Superclass for builders of chains of database checks
module Api
  module V3
    module DatabaseChecks
      class CheckChain
        delegate :url_helpers, to: 'Rails.application.routes'

        def initialize(object, errors_list)
          @object = object
          @errors_list = errors_list
        end

        def self.validates(validation, options = {})
          @validations ||= []
          @validations << {validation: validation, options: options}
        end

        def chain
          tmp = []
          self.class.instance_variable_get('@validations').each do |validation|
            validation_class = Api::V3::DatabaseChecks.const_get(
              validation[:validation].to_s.camelize
            )
            options = validation[:options].dup
            link_options = options.delete(:link)
            if link_options&.key?(:method)
              link = url_helpers.send(
                link_options[:method],
                link_options[:params]
              )
              options[:link] = link
            end
            tmp << validation_class.new(@object, options)
          end
          tmp
        end
      end
    end
  end
end
