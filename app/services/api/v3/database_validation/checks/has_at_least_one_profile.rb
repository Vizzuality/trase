# Checks the presence of at least one associated profile of given type.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasAtLeastOneProfile < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :profile_type
          def initialize(object, options)
            super(object, options)
            if Api::V3::Profile::NAME.include? options[:profile_type]
              @profile_type = options[:profile_type]
            end
          end

          def passing?
            tmp = @object.profiles
            if @profile_type
              tmp = tmp.where('profiles.name' => @profile_type)
            end
            tmp.any?
          end

          private

          def error
            message = [
              'At least one',
              @profile_type,
              'profile should be present'
            ].join(' ')
            super.merge(
              message: message
            )
          end
        end
      end
    end
  end
end
