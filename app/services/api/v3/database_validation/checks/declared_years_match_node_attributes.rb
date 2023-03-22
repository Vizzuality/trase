# Check if the years declared in +years+ column of a:
# - map_attribute
# match the data available in flow_inds/quants/quals.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class DeclaredYearsMatchNodeAttributes < AbstractCheck
          # @param (see AbstractCheck#initialize)
          # @option options (see AbstractCheck#initialize)
          # @option options [symbol] :association name of +has_one+ association
          #   e.g. +:resize_by_quant+
          def initialize(object, options)
            super(object, options)
            @association = options[:association]
          end

          # Checks the flows table
          # joined with relevant flows_inds/quals/quants table
          # to get the array of years for which values exist
          # for the attribute in question
          # @return (see AbstractCheck#passing?)
          def passing?
            declared_years = @object.years
            return true if declared_years.nil?

            # @association is e.g. :resize_by_quant
            associated_object = @object.send(@association)
            return true unless associated_object.present?
            # e.g. quant
            attribute_name = @association.to_s.split("_").last
            # e.g. ind_id
            attribute_id_name = "#{attribute_name}_id"

            # flow attributes table
            values_class = ("Api::V3::" + "node_#{attribute_name}".camelize).
              constantize

            actual_years = values_class.
              select(:year).
              where(
                attribute_id_name => associated_object.send(attribute_id_name)
              ).
              distinct.all.map(&:year)
            actual_years.compact.sort == declared_years.compact.sort
          end

          def self.human_readable(options)
            "declared year range on #{options[:association]} matches node attributes"
          end

          private

          def error
            super.merge(
              message: "#{@association} years declared differ from available node attributes"
            )
          end
        end
      end
    end
  end
end
