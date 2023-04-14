module Api
  module Public
    module Flows
      class ResponseBuilder
        attr_reader :data

        def initialize(params = {})
          initialize_params(params)
        end

        def call
          initialize_flows

          apply_filters

          @query
        end

        private

        def initialize_params(params)
          if params[:country]
            @country = Api::V3::Country.find_by(iso2: params[:country])
            raise "Country not found" unless @country
          end

          if params[:commodity]
            @commodity = Api::V3::Commodity.find_by(name: params[:commodity])
            raise "Commodity not found" unless @commodity
          end

          @end_year = params[:end_year]
          @start_year = params[:start_year]

          if params[:attribute_id]
            @attribute =
              Api::V3::Readonly::Attribute.find_by(id: params[:attribute_id])
            raise "Attribute not found" unless @attribute
          else
            @attribute =
              Dictionary::Quant.instance.get("Volume").readonly_attribute
          end
        end

        def initialize_flows
          @query = Api::V3::Flow.all.
            select(*flow_select_clause).
            joins("INNER JOIN contexts ON contexts.id = flows.context_id").
            group(*flow_group_clause)

          apply_flow_join_clauses
        end

        def flow_select_clause
          attribute_table_name = @attribute.flow_values_class.table_name
          [
            "flows.year",
            "flows.path",
            "json_agg(" \
              "json_build_object(" \
                "'attribute_id', attributes.id, " \
                "'value', #{attribute_table_name}.value" \
              ")" \
            ") AS flow_attributes"
          ]
        end

        def flow_group_clause
          ["flows.id", "flows.year", "flows.path"]
        end

        def apply_flow_join_clauses
          original_type = @attribute.original_type
          attribute_id_name = @attribute.attribute_id_name
          attribute_table_name = @attribute.flow_values_class.table_name
          @query = @query.
            joins("INNER JOIN #{attribute_table_name} ON #{attribute_table_name}.flow_id = flows.id").
            joins(
              "INNER JOIN attributes ON attributes.original_type = '#{original_type}' AND "\
              "           attributes.original_id = #{attribute_table_name}.#{attribute_id_name}"
            )
        end

        def apply_filters
          apply_country_filter
          apply_commodity_filter
          apply_start_year_filter
          apply_end_year_filter
        end

        def apply_country_filter
          return unless @country

          @query = @query.where("contexts.country_id = ?", @country.id)
        end

        def apply_commodity_filter
          return unless @commodity

          @query = @query.where("contexts.commodity_id = ?", @commodity.id)
        end

        def apply_start_year_filter
          return unless @start_year

          @query = @query.where("flows.year >= ?", @start_year)
        end

        def apply_end_year_filter
          return unless @end_year

          @query = @query.where("flows.year <= ?", @end_year)
        end
      end
    end
  end
end
