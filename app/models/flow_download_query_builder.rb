class FlowDownloadQueryBuilder

  def initialize(context, params)
    @context = context
    @query = MaterializedFlow.where(context_id: @context.id)
    initialise_group_0_columns(@context.id)
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
      '"Year"'
    ] + @group_0_select_aliases + [
      '"Port"', '"Exporter"', '"Importer"', '"Country"', '"Type"'
    ] + categories_names_quoted

    crosstab_columns = [
      'row_name INT[]',
      '"Year" int'
    ] + @group_0_crosstab_columns +
    [
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

  def initialise_group_0_columns(context_id)
    group_0_node_types = ContextNode.where(context_id: context_id, column_group: 0).
      joins(:node_type).
      pluck('node_types.node_type')
    @group_0_select_columns, @group_0_crosstab_columns, @group_0_select_aliases = if group_0_node_types.include?(NodeTypeName::MUNICIPALITY)
      [
        [
          'municipality AS "Municipality"',
          'state AS "State"',
          'biome AS "Biome"'
        ],
        [
          '"Municipality" text',
          '"State" text',
          '"Biome" text'
        ],
        [
          '"Municipality"', '"State"', '"Biome"'
        ]
      ]
    elsif group_0_node_types.include?(NodeTypeName::DEPARTMENT)
      [
        ['department AS "Department"'],
        ['"Department" text'],
        ['"Department"']
      ]
    elsif group_0_node_types.include?(NodeTypeName::PORT)
      [
        ['port AS "Port-"'],
        ['"Port-" text'],
        ['"Port-"']
      ]
    else
      [
        ['country_of_production AS "Country (prod)"'],
        ['"Country (prod)" text'],
        ['"Country (prod)"']
      ]
    end
  end

  def flat_select_columns
    [
      'year AS "Year"'
    ] + @group_0_select_columns +
    [
      'exporter_port_node AS "Port"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country"',
      "'#{commodity_type}' AS Type",
      'name_in_download AS "Indicator"',
      'total AS "Total"'
    ]
  end

  def pivot_select_columns
    [
      'ARRAY[year, node_id, exporter_node_id, exporter_port_node_id, importer_node_id, country_node_id]::INT[] AS row_name',
      'year AS "Year"'
    ] + @group_0_select_columns +
    [
      'exporter_port_node AS "Port"',
      'exporter_node AS "Exporter"',
      'importer_node AS "Importer"',
      'country_node AS "Country"',
      "'#{commodity_type}' AS Type",
      'name_in_download',
      'total'
    ]
  end

  def commodity_type
    if @context.commodity.try(:name) == 'SOY'
      'Soy bean equivalents'
    else
      @context.commodity.try(:name).try(:humanize) || 'UNKNOWN'
    end
  end
end
