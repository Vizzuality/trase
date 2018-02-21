# Checks that where multiple possiblt +has_one+ relationships defined
# only one of them is present.
# e.g. check that map_attribute has either a +map_quant+ or +map_ind+
# but not both.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasOneAssociationVariantPresent < AbstractCheck
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

          private

          def error
            error_hash =
              if @count.zero?
                error_when_none_present
              else
                error_when_more_present
              end
            super.merge error_hash
          end

          def error_when_none_present
            {
              message: "#{@associations.join(', ')} missing"
            }
          end

          def error_when_more_present
            {
              message: "More than one of #{@associations.join(', ')} present"
            }
          end
        end
      end
    end
  end
end
