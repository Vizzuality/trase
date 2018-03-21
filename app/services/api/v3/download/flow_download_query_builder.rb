module Api
  module V3
    module Download
      class FlowDownloadQueryBuilder
        QUAL_OPS = {
          'eq' => '='
        }.freeze
        QUANT_OPS = QUAL_OPS.merge(
          'lt' => '<',
          'gt' => '>'
        ).freeze

        # @param context [Api::V3::Context]
        # @param params [Hash]
        # @option params [Array<Integer>] :years
        # @option params [Array<Integer>] :e_ids exporters ids
        # @option params [Array<Integer>] :i_ids importers ids
        # @option params [Array<Integer>] :c_ids countries ids
        # @option params [Array<Hash>] :filters advanced attribute filters
        #   e.g. [{"name"=>"ZERO_DEFORESTATION", "op"=>"eq", "val"=>"no"}]
        def initialize(context, params)
          @context = context
          @query = Api::V3::Readonly::DownloadFlow.where(
            context_id: @context.id
          )
          initialize_path_column_names(@context.id)
          if (years = params[:years]).present?
            @query = @query.where(year: years)
          end
          if (exporters_ids = params[:e_ids]).present?
            @query = @query.where(exporter_node_id: exporters_ids)
          end
          if (importers_ids = params[:i_ids]).present?
            @query = @query.where(importer_node_id: importers_ids)
          end
          if (countries_ids = params[:c_ids]).present?
            @query = @query.where(country_node_id: countries_ids)
          end
          return unless (filters = params[:filters]).present?
          apply_attribute_filters(filters)
        end

        def flat_query
          @query.select(flat_select_columns)
        end

        def pivot_query
          source = @query.select(pivot_select_columns)
          source_sql = source.to_sql.gsub("'", "''")
          categories = @query.
            select('display_name').
            group(:display_name).
            order(:display_name)
          categories_sql = categories.to_sql.gsub("'", "''")
          categories_names_quoted = categories.map do |c|
            '"' + c['display_name'] + '"'
          end
          categories_names_with_type = categories_names_quoted.map do |cn|
            cn + ' text'
          end

          select_columns = [
            '"YEAR"'
          ] + @path_column_aliases + [
            '"TYPE"'
          ] + categories_names_quoted

          crosstab_columns = [
            'row_name INT[]',
            '"YEAR" int'
          ] + @path_crosstab_columns + [
            '"TYPE" text'
          ] + categories_names_with_type

          crosstab_sql = <<~SQL
            public.CROSSTAB(
              '#{source_sql}',
              '#{categories_sql}'
            )
            AS CT(#{crosstab_columns.join(',')})
          SQL

          Api::V3::Readonly::DownloadFlow.
            select(select_columns).from(crosstab_sql)
        end

        private

        def flat_select_columns
          [
            'year AS "YEAR"'
          ] + @path_columns +
            [
              "'#{commodity_type}'::TEXT AS \"TYPE\"",
              'display_name AS "INDICATOR"',
              'total AS "TOTAL"'
            ]
        end

        def pivot_select_columns
          [
            'ARRAY[' +
              (
                ['year'] +
                @path_crosstab_row_name_columns
              ).join(', ') +
              ']::INT[] AS row_name',
            'year AS "YEAR"'
          ] + @path_columns +
            [
              "'#{commodity_type}'::TEXT AS \"TYPE\"",
              'display_name',
              'total'
            ]
        end

        def commodity_type
          if @context.commodity.try(:name) == 'SOY'
            'Soy bean equivalents'
          else
            "#{@context.commodity.try(:name).try(:humanize)} equivalents" ||
              'UNKNOWN'
          end
        end

        def initialize_path_column_names(context_id)
          context_node_types = Api::V3::ContextNodeType.
            select([:column_position, 'node_types.name']).
            where(context_id: context_id).
            joins(:node_type).
            order(:column_position)
          context_column_positions = context_node_types.pluck(:column_position)
          path_column_names = context_column_positions.map { |p| "name_#{p}" }
          @path_column_aliases = context_node_types.
            pluck('node_types.name').
            map { |nt| "\"#{nt}\"" }
          @path_columns = path_column_names.each_with_index.map do |n, idx|
            "#{n} AS #{@path_column_aliases[idx]}"
          end
          @path_crosstab_columns = @path_column_aliases.map { |a| "#{a} text" }
          @path_crosstab_row_name_columns = context_column_positions.map do |p|
            "node_id_#{p}"
          end
        end

        def apply_attribute_filters(attributes_list)
          query_parts = []
          parameters = []

          attributes_list.each do |attr_hash|
            attribute = attribute_by_name(attr_hash[:name])
            next unless attribute

            attr_query_parts, attr_parameters = attribute_filter(
              attribute, *attr_hash.values_at(:op, :val)
            )
            query_parts << attr_query_parts.join(' AND ')
            parameters += attr_parameters
          end
          @query = @query.where(
            query_parts.join(' OR '), *parameters
          )
        end

        def attribute_by_name(name)
          return nil unless name
          Dictionary::Quant.instance.get(name) ||
            Dictionary::Qual.instance.get(name)
        end

        def attribute_filter(attribute, op_symbol, val)
          query_parts = ['attribute_type = ?', 'attribute_id = ?']
          parameters = [attribute.class.name.demodulize, attribute.id]
          op_part, val =
            if attribute.is_a? Api::V3::Qual
              [qual_op_part(op_symbol), val]
            else
              [quant_op_part(op_symbol), val&.to_f]
            end
          if op_part && val
            query_parts << op_part
            parameters << val
          end
          [query_parts, parameters]
        end

        def qual_op_part(op_symbol)
          op = QUAL_OPS[op_symbol]
          return nil unless op
          "LOWER(total) #{op} LOWER(?)"
        end

        def quant_op_part(op_symbol)
          op = QUANT_OPS[op_symbol]
          return nil unless op
          "sum #{op} ?"
        end
      end
    end
  end
end
