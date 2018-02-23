# @abstract
# Superclass for database checks which run on a model instance and store errors
# in an injected errors list.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class AbstractCheck
          delegate :url_helpers, to: 'Rails.application.routes'

          # @param object [subclass of Api::V3::BaseModel]
          # @param options [Hash]
          # @option options [symbol] :link optional +:index+ or +:edit+
          # @option options [symbol] :severity either +:error+ (default) or +:warn+
          def initialize(object, options = {})
            @object = object
            @link = options[:link]
            @severity = options[:severity] || :error
          end

          # Calls {#passing?} and saves error when it fails
          # @param errors_list [Api::V3::DatabaseValidation::ErrorsList]
          def call(errors_list)
            return if passing?
            errors_list.add(error)
          end

          # @abstract
          # @return [boolean] whether the check is passing
          # @raise [NotImplementedError] when not defined in subclass
          def passing?
            raise NotImplementedError
          end

          private

          def initialize_on_object(options)
            return unless options.key?(:on)
            on_object_name = options[:on]
            return unless @object.respond_to?(on_object_name)
            @on_object = @object.send(on_object_name)
          end

          def error
            {
              object: @object,
              type: self.class.name,
              link: generate_link,
              severity: @severity
            }
          end

          def generate_link
            return generate_edit_link if @link == :edit
            return nil unless @link == :index && @association.present?
            url_helpers.url_for([:admin, @association, only_path: true])
          end

          def generate_edit_link
            return nil unless @link == :edit
            object = @on_object || @object
            object_class = object.class.name
            object_name = object_class.demodulize.underscore
            url_helpers.url_for(
              [:edit, :admin, object_name, id: object.id, only_path: true]
            )
          end
        end
      end
    end
  end
end
