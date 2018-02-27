# Checks the presence of associated object via +has_one+
#   relationship.
# e.g. check that context has a context_property
# @note this could work with a +belongs_to+ as well, but that is better
# handled using an AR validation
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasExactlyOne < HasExactlyOneOf
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name of +has_one+ association
          #   e.g. +:context_property+
          def initialize(object, options)
            super(object, options)
            @associations = [options[:association]]
          end
        end
      end
    end
  end
end
