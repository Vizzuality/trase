# Checks the presence of at least one associated object via +has_many+
#   relationship.
# e.g. check that context has any profiles
# @note the has_many relationship may be a +has_many :through+
module Api
  module V3
    module DatabaseValidation
      module Checks
        class HasManyAssociationAny < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name of has_many association
          #   e.g. +:profiles+
          # @option options [Hash] :conditions conditions to pass; you may need
          #   to provide qualified column names
          #   e.g. +'profiles.name' => Api::V3::Profile::ACTOR+
          def initialize(object, options)
            super(object, options)
            @association = options[:association]
            @conditions = options[:conditions]
          end

          def passing?
            tmp = @object.send(@association)
            if @conditions.present? && @conditions.is_a?(Hash)
              tmp = tmp.where(@conditions)
            end
            tmp.any?
          end

          private

          def error
            super.merge(
              message: "#{@association} missing #{@conditions}",
              suggestion: 'Please create some at :link'
            )
          end
        end
      end
    end
  end
end
