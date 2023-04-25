module Api
  module V3
    module Download
      class FlowDownloadFlatQuery
        def initialize(context, download_attributes, base_query, size_query)
          @context = context
          @download_attributes = download_attributes
          initialize_path_column_names(@context.id)
          @base_query = base_query
          @size_query = size_query
          initialize_query
        end

        def all
          @query
        end

        # Calculating the total is too expensive, use an estimation instead
        def total
          @size_query.sum("count::INT")
        end

        MAX_SIZE = 500_000

        def chunk_by_year?
          total > MAX_SIZE
        end

        def years
          @size_query.distinct.pluck(:year)
        end

        def by_year(year)
          all.where(year: year)
        end

        private

        def initialize_query
          @query = @base_query.select(flat_select_columns).
            order(:row_name, "flows.attribute_type", "flows.attribute_id")
        end

        def flat_select_columns
          [
            'year AS "YEAR"'
          ] + @path_columns +
            [
              "'#{commodity_type}'::TEXT AS \"TYPE\"",
              'download_attributes_v.display_name AS "INDICATOR"',
              'total AS "TOTAL"'
            ]
        end

        def commodity_type
          commodity_name = @context.commodity.try(:name)
          if commodity_name == "SOY"
            "Soy bean equivalents"
          else
            "#{commodity_name.try(:humanize)} equivalents" ||
              "UNKNOWN"
          end
        end

        # rubocop:disable Metrics/MethodLength
        def initialize_path_column_names(context_id)
          context_node_types = Api::V3::ContextNodeType.
            select([:column_position, "node_types.name"]).
            where(context_id: context_id).
            joins(:node_type).
            order(:column_position)
          context_column_positions = context_node_types.pluck(:column_position)
          path_column_names = context_column_positions.map { |p| "names[#{p + 1}]" }
          @path_column_aliases = context_node_types.
            pluck("node_types.name").
            map { |nt| "\"#{nt}\"" }
          @path_columns = path_column_names.each_with_index.map do |n, idx|
            "#{n} AS #{@path_column_aliases[idx]}"
          end
          @path_crosstab_columns = @path_column_aliases.map { |a| "#{a} text" }
        end
        # rubocop:enable Metrics/MethodLength
      end
    end
  end
end
