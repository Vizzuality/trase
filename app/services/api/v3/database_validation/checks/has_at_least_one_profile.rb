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
            @association = :profiles
            @profile_type = options[:profile_type]
          end

          def passing?
            tmp = @object.profiles
            if Api::V3::Profile::NAMES.include? @profile_type
              tmp = tmp.where('profiles.name' => @profile_type)
            end
            tmp.any?
          end

          def self.human_readable(options)
            "presence of at least one #{options[:profile_type]} profile"
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
