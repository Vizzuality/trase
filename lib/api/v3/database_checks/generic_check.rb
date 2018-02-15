# @abstract
# Superclass for database checks which run on a model instance and store errors
# in an injected errors list.
module Api
  module V3
    module DatabaseChecks
      class GenericCheck
        # @param object [subclass of Api::V3::BaseModel]
        # @param options [Hash]
        # @option options [symbol] :link optional link included in error suggestion
        # @option options [symbol] :severity either +:error+ (default) or +:warn+
        def initialize(object, options = {})
          @object = object
          @link = options[:link]
          @severity = options[:severity] || :error
        end

        # Calls {#passing?} and saves error when it fails
        # @param errors_list [Api::V3::DatabaseChecks::ErrorsList]
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

        def error
          {
            object: @object,
            type: self.class.name,
            link: @link,
            severity: @severity
          }
        end
      end
    end
  end
end
