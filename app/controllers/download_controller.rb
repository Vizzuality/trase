class DownloadController < ApplicationController
  before_action :set_separator, only: :index

  def index
    qb = FlowDownloadQueryBuilder.new(@context.id, params)

    respond_to do |format|
      format.csv {
        query = if params[:pivot]
          qb.pivot_query
        else
          qb.flat_query
        end
        csv = PgCsv.new(
          sql: query.to_sql,
          header: true,
          delimiter: @separator,
          encoding: 'UTF8',
          type: :plain
        )
        send_data csv.export,
          type: 'text/csv; charset=utf-8; header=present',
          disposition: "attachment; filename=#{@context.country.name}_#{@context.commodity.name}_#{DownloadVersion.current_version_symbol}.csv"
      }
      format.json {
        send_data qb.flat_query.to_json,
          type: 'text/json; charset=utf-8',
          disposition: "attachment; filename=#{@context.country.name}_#{@context.commodity.name}_#{DownloadVersion.current_version_symbol}.json"
      }
    end
  end

  private

  def set_separator
    @separator = if params[:separator].present? && params[:separator] == 'semicolon'
      ';'
    else
      ','
    end
  end
end
