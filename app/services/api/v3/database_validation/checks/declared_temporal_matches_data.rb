# Check if the temporal flag matches data in node_inds/quals/quants
# if temporal is true, expect year present
# if temporal is false, expect year blank
module Api
  module V3
    module DatabaseValidation
      module Checks
        class DeclaredTemporalMatchesData < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name association used to
          #   check data, e.g. +:node_inds+
          # @option options [symbol] :attribute name of attribute with
          #   temporal flag, e.g. +is_temporal_on_place_profile+
          # @option options [symbol] :on name of the object on which attribute
          #   is defined, e.g. +ind_property+
          def initialize(object, options)
            super(object, options)
            @association = options[:association]
            @attribute = options[:attribute]
            initialize_on_object(options)
          end

          # Checks the node_inds/quals/quants table for year
          # @return (see AbstractCheck#passing?)
          def passing?
            return true unless @on_object.present?
            @is_temporal = @on_object.send(@attribute)
            tmp = @object.send(@association)
            if @is_temporal
              tmp = tmp.where('year IS NULL')
            else
              tmp = tmp.where('year IS NOT NULL')
            end
            tmp.empty?
          end

          private

          def error
            error_hash =
              if @is_temporal
                error_when_temporal
              else
                error_when_not_temporal
              end
            super.merge error_hash
          end

          def error_when_temporal
            {
              message: "Expected temporal data but year missing in #{@association}"
            }
          end

          def error_when_not_temporal
            {
              message: "Expected non-temporal data but year present in #{@association}"
            }
          end
        end
      end
    end
  end
end
