module Api
  module V3
    module Download
      class FlowDownloadPivotQuery < FlowDownloadFlatQuery
        def all
          pivot(@query)
        end

        def total
          pivot(@base_query.select(pivot_select_columns)).except(:select).count
        end

        def by_year(year)
          pivot(@query.where(year: year))
        end

        private

        def initialize_query
          @query = @base_query.select(pivot_select_columns).
            order(:row_name)
        end

        def pivot_select_columns
          [
            'row_name',
            'year AS "YEAR"'
          ] + @path_columns +
            [
              "'#{commodity_type}'::TEXT AS \"TYPE\"",
              'display_name',
              'total'
            ]
        end

        def initialize_categories_names(query)
          @categories = query.
            except(:select).
            select('display_name').
            except(:group).
            group(:display_name).
            except(:order).
            order(:display_name)
          @categories_names_quoted = @categories.map do |c|
            '"' + c['display_name'] + '"'
          end
          @categories_names_with_type = @categories_names_quoted.map do |cn|
            cn + ' text'
          end
        end

        def outer_select_columns
          [
            '"YEAR"'
          ] + @path_column_aliases + [
            '"TYPE"'
          ] + @categories_names_quoted
        end

        def crosstab_columns
          [
            'row_name INT[]',
            '"YEAR" int'
          ] + @path_crosstab_columns + [
            '"TYPE" text'
          ] + @categories_names_with_type
        end

        def pivot(query)
          initialize_categories_names(query)

          source_sql = query.to_sql.gsub("'", "''")
          categories_sql = @categories.to_sql.gsub("'", "''")

          crosstab_sql = <<~SQL
            public.CROSSTAB(
              '#{source_sql}',
              '#{categories_sql}'
            )
            AS CT(#{crosstab_columns.join(',')})
          SQL

          Api::V3::Readonly::DownloadFlow.
            select(outer_select_columns).from(crosstab_sql)
        end
      end
    end
  end
end
