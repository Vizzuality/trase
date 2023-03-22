# Checks that where multiple possiblt +has_one+ relationships defined
# only one of them is present.
# e.g. check that map_attribute has either a +map_quant+ or +map_ind+
# but not both.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasExactlyOneOf < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :associations names of +has_one+
          #   associations, e.g. +[:map_ind, :map_quant]+
          def initialize(object, options)
            super(object, options)
            @associations = options[:associations]
          end

          # @return (see AbstractCheck#passing?)
          def passing?
            @count = @associations.select do |association|
              @object.send(association).present?
            end.size
            @count == 1
          end

          def self.human_readable(options)
            "presence of exactly one of #{options[:associations]}"
          end

          private

          def error
            message = [
              "Exactly one of",
              @associations.join(" or "),
              "should be present",
              "(#{@count} found)"
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
