# This service is started by MapAttributesExport.
module Api
  module V3
    class MapAttributesCartoUpload
      # @param carto_name [String]
      # @param columns [Array<String>]
      # @param file_path [String]
      def initialize(carto_name, column_names, file_path)
        @carto_name = carto_name
        @column_names = column_names
        @file_path = file_path
      end

      def call
        uri = URI("https://#{host}/api/v2/sql/copyfrom?#{auth}&q=#{copy_sql}")
        request = Net::HTTP::Post.new(uri.path + '?' + uri.query)
        request['Content-Encoding'] = 'gzip'
        request['Transfer-Encoding'] = 'chunked'
        request['Content-Type'] = 'application/octet-stream'
        request.body = File.read(@file_path)
        # https://www.exceptionalcreatures.com/bestiary/Net/ReadTimeout.html
        response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, read_timeout: 300) { |http| http.request(request) }
        # this will raise an exception and force sidekiq retry
        response.value unless response.is_a? Net::HTTPSuccess
      end

      private

      def host
        "#{ENV['CARTO_ACCOUNT']}.carto.com"
      end

      def auth
        "api_key=#{ENV['CARTO_TOKEN']}"
      end

      def copy_sql
        "COPY #{@carto_name} (#{@column_names.join(', ')}) FROM STDIN WITH (FORMAT csv, HEADER true)"
      end
    end
  end
end
