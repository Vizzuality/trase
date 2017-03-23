class FlowDownloadQueryBuilder

  def initialize(context_id, params)
    @query = MaterializedFlow.where(context_id: context_id)
    if params[:years].present?
      @query = @query.where(year: params[:years])
    end
    if params[:indicators].present?
      tmp = [Quant, Ind, Qual].map do |indicator_class|
        indicators = indicator_class.where(name: params[:indicators])
        [indicator_class, indicators]
      end
      memo = {query: [], placeholders: []}
      [Quant, Ind, Qual].inject(memo) do |memo, indicator_class|
        indicators = indicator_class.where(name: params[:indicators])
        if indicators.any?
          memo[:query] << "indicator_type = ? AND indicator_id IN (?)"
          memo[:placeholders] << indicator_class.name
          memo[:placeholders] << indicators.pluck(indicator_class.name.downcase + '_id')
        end
        memo
      end
      @query = @query.where(memo[:query].join(' OR '), *memo[:placeholders])
    end
    if params[:exporters_ids].present?
      @query = @query.where(exporter_node_id: params[:exporters_ids])
    end
    if params[:importers_ids].present?
      @query = @query.where(importer_node_id: params[:importers_ids])
    end
    if params[:countries_ids].present?
      @query = @query.where(country_node_id: params[:countries_ids])
    end
  end

  def flat_query
    @query.select(flat_select_columns)
  end

  def pivot_query
    source = @query.select(pivot_select_columns)
    source_sql = source.to_sql.gsub("'", "''")
    categories = @query.
      select("indicator_with_unit || ' ' ||  year AS indicator_year").
      group([:year, :indicator_with_unit]).
      order([:year, :indicator_with_unit])
    categories_sql = categories.to_sql.gsub("'", "''")
    categories_names_quoted = categories.map{ |c| '"' + c['indicator_year'] + '"' }
    categories_names_with_type = categories_names_quoted.map{ |cn| cn + ' text' }.join(',')

    MaterializedFlow.select(
      ['"Name"', '"Geo code"', '"Exporter"', '"Importer"', '"Country of dest"'] +
      categories_names_quoted
    ).from(
    <<-SQL
      CROSSTAB(
        '#{source_sql}',
        '#{categories_sql}'
      )
      AS CT(
        row_name INT[],
        "Name" text,
        "Geo code" text,
        "Exporter" text,
        "Importer" text,
        "Country of dest" text,
        #{categories_names_with_type}
      )
    SQL
    )
  end

  private

  def flat_select_columns
    [
      'node AS "Name"',
      'geo_id AS "Geo code"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country of dest"',
      'indicator_with_unit AS "Indicator"',
      'total AS "Total"',
      'year AS "Year"'
    ]
  end

  def pivot_select_columns
    [
      'ARRAY[node_id, exporter_node_id, importer_node_id, country_node_id, indicator_id]::INT[] AS row_name',
      'node AS "Name"',
      'geo_id AS "Geo code"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country of dest"',
      "indicator_with_unit || ' ' || year",
      'total'
    ]
  end

end
