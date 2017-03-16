class DownloadController < ApplicationController
  before_action :set_separator, only: :index

  def index
    query = FlowDownloadQueryBuilder.new(@context.id, params).query

    respond_to do |format|
      format.csv {
        csv = PgCsv.new(
          sql: query.to_sql,
          header: true,
          delimiter: @separator,
          encoding: 'UTF8',
          type: :plain
        )
        send_data csv.export,
          type: 'text/csv; charset=utf-8; header=present',
          disposition: "attachment; filename=#{@context.country.name}_#{@context.commodity.name}.csv"
      }
      format.json {
        send_data query.to_json,
          type: 'text/json; charset=utf-8',
          disposition: "attachment; filename=#{@context.country.name}_#{@context.commodity.name}.json"
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
