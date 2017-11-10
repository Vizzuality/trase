require 'fileutils'
require 'tempfile'
require 'zip'

class FlowDownload
  attr_reader :download_name

  def initialize(context, params)
    @context = context
    @pivot = params[:pivot].present?
    @separator = if params[:separator].present? && params[:separator] == 'semicolon'
                   ';'
                 else
                   ','
                 end
    @download_name = [@context.country.name, @context.commodity.name, DownloadVersion.current_version_symbol(@context)].compact.join('_')
    query_builder = FlowDownloadQueryBuilder.new(@context, params)
    @query = if @pivot
               query_builder.pivot_query
             else
               query_builder.flat_query
             end
  end

  def zipped_csv
    csv = PgCsv.new(
      sql: @query.to_sql,
      header: true,
      delimiter: @separator,
      encoding: 'UTF8',
      type: :plain,
      logger: Rails.logger
    )
    content = csv.export
    # NOTE: exporting directly into file raises encoding errors
    filename = "#{@download_name}.csv"
    tempfile = Tempfile.new(filename)
    tempfile << content
    tempfile.close
    add_to_zip(filename, tempfile.path)
  end

  def zipped_json
    content = @query.map(&:as_json)
    filename = "#{@download_name}.json"
    tempfile = Tempfile.new(filename)
    tempfile << content
    tempfile.close
    add_to_zip(filename, tempfile.path)
  end

  private

  def add_to_zip(filename, path)
    temp_zipfile = Tempfile.new("#{@download_name}.zip")
    Zip::OutputStream.open(temp_zipfile) { |zos| }
    Zip::File.open(temp_zipfile.path, Zip::File::CREATE) do |zipfile|
      zipfile.add(filename, path)
      zipfile.add('README.pdf', "#{Rails.root}/public/README.pdf")
    end
    temp_zipfile
  end
end
