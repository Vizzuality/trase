module Api
  module V3
    module Download
      class FlowDownloadQueryBuilder
        def initialize(context, params)
          @context = context
          @query = Api::V3::Readonly::DownloadFlow.where(context_id: @context.id)
          initialize_path_column_names(@context.id)
          @query = @query.where(year: params[:years]) if params[:years].present?
          if params[:indicators].present?
            memo = {query: [], placeholders: []}
            [Quant, Ind, Qual].each_with_object(memo) do |indicator_class, memo_object|
              indicators = indicator_class.where(name: params[:indicators])
              next unless indicators.any?
              memo_object[:query] << 'attribute_type = ? AND attribute_id IN (?)'
              memo_object[:placeholders] << indicator_class.name
              memo_object[:placeholders] << indicators.pluck(indicator_class.name.downcase + '_id')
            end
            @query = @query.where(memo[:query].join(' OR '), *memo[:placeholders])
          end
          if params[:exporters_ids].present?
            @query = @query.where(exporter_node_id: params[:exporters_ids])
          end
          if params[:importers_ids].present?
            @query = @query.where(importer_node_id: params[:importers_ids])
          end
          return unless params[:countries_ids].present?
          @query = @query.where(country_node_id: params[:countries_ids])
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
          categories_names_quoted = categories.map { |c| '"' + c['display_name'] + '"' }
          categories_names_with_type = categories_names_quoted.map { |cn| cn + ' text' }

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
            "#{@context.commodity.try(:name).try(:humanize)} equivalents" || 'UNKNOWN'
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
          @path_crosstab_row_name_columns = context_column_positions.map { |p| "node_id_#{p}" }
        end
      end
    end
  end
end
