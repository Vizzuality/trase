# Checks the presence of associated object via +has_one+
#   relationship.
# e.g. check that context has a context_property
# @note this could work with a +belongs_to+ as well
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasOneAssociationPresent < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name of +has_one+ association
          #   e.g. +:context_property+
          def initialize(object, options)
            super(object, options)
            @association = options[:association]
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            @object.send(@association).present?
          end

          private

          def error
            super.merge(
              message: "#{@association} missing",
              suggestion: 'Please create one at :link'
            )
          end
        end
      end
    end
  end
end
