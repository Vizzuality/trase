# Check if the years declared in +years+ column of a:
# - resize_by_attribute
# - recolor_by_attribute
# - download_attribute
# - map_attribute
# match the data available.
module Api
  module V3
    module DatabaseChecks
      class DeclaredYearsMatchData < GenericCheck
        # @param (see GenericCheck#initialize)
        # @option options (see GenericCheck#initialize)
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
        # @return (see GenericCheck#passing?)
        def passing?
          # @association is e.g. :resize_by_quant
          associated_object = @object.send(@association)
          return true unless associated_object.present?
          # e.g. quant
          attribute_name = @association.to_s.split('_').last
          # e.g. ind_id
          attribute_id_name = "#{attribute_name}_id"

          # flow attributes table
          values_class = ('Api::V3::' + "flow_#{attribute_name}".camelize).
            constantize
          declared_years = @object.years || []
          actual_years = values_class.
            select('flows.year').
            joins(:flow).
            where(
              attribute_id_name => associated_object.send(attribute_id_name)
            ).
            distinct.all.map(&:year)
          actual_years.sort == declared_years.sort
        end

        private

        def error
          super.merge(
            message: "#{@association} years declared differ from available",
            suggestion: 'Please amend at :link'
          )
        end
      end
    end
  end
end
