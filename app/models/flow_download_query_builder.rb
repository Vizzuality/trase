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
      select('name_in_download').
      group(:name_in_download).
      order(:name_in_download)
    categories_sql = categories.to_sql.gsub("'", "''")
    categories_names_quoted = categories.map{ |c| '"' + c['name_in_download'] + '"' }
    categories_names_with_type = categories_names_quoted.map{ |cn| cn + ' text' }

    select_columns = [
      '"Year"', '"Municipality"', '"State"', '"Biome"', '"Port"', '"Exporter"', '"Importer"', '"Country"', '"Type"'
    ] + categories_names_quoted

    crosstab_columns = [
      'row_name INT[]',
      '"Year" int',
      '"Municipality" text',
      '"State" text',
      '"Biome" text',
      '"Port" text',
      '"Exporter" text',
      '"Importer" text',
      '"Country" text',
      '"Type" text'
    ] + categories_names_with_type

    crosstab_sql =<<~SQL
      CROSSTAB(
        '#{source_sql}',
        '#{categories_sql}'
      )
      AS CT(#{crosstab_columns.join(',')})
    SQL

    MaterializedFlow.select(select_columns).from(crosstab_sql)
  end

  private

  def flat_select_columns
    [
      'year AS "Year"',
      'municipality AS "Municipality"',
      'state AS "State"',
      'biome AS "Biome"',
      'exporter_port_node AS "Port"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country"',
      "'Soy bean equivalents' AS Type",
      'name_in_download AS "Indicator"',
      'total AS "Total"'
    ]
  end

  def pivot_select_columns
    [
      'ARRAY[year, node_id, exporter_node_id, exporter_port_node_id, importer_node_id, country_node_id]::INT[] AS row_name',
      'year AS "Year"',
      'municipality AS "Municipality"',
      'state AS "State"',
      'biome AS "Biome"',
     'exporter_port_node AS "Port"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country"',
      "'Soy bean equivalents' AS Type",
      'name_in_download',
      'total'
    ]
  end

end
