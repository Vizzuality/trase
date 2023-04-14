# Checks the presence of at least one associated object via +has_many+
#   relationship.
# e.g. check that context has any profiles
# @note the has_many relationship may be a +has_many :through+
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasAtLeastOne < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name of has_many association
          #   e.g. +:profiles+
          def initialize(object, options)
            super(object, options)
            @association = options[:association]
          end

          def passing?
            @object.send(@association).any?
          end

          def self.human_readable(options)
            "presence of at least one #{options[:association].to_s.humanize.singularize}"
          end

          private

          def error
            message = [
              "At least one",
              @association.to_s.singularize,
              "should be present"
            ].join(" ")
            super.merge(
              message: message
            )
          end
        end
      end
    end
  end
end
