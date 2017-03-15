class FlowDownloadQueryBuilder
  attr_reader :query

  def initialize(context_id, params)
    @query = MaterializedFlow.select(select_columns).where(context_id: context_id)
    if params[:years].present?
      @query = @query.where(year: params[:years])
    end
    if params[:quants_ids].present?
      @query = @query.where(quant_id: params[:quants_ids])
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
    @query = @query.group([:node, :geo_id, :year, :exporter_node, :importer_node, :country_node, :name])
  end

  private
  def group_columns
    [
      :node,
      :geo_id,
      :year,
      :exporter_node,
      :importer_node,
      :country_node,
      :name
    ]
  end

  def select_columns
    group_columns + ['SUM(value)']
  end
end
