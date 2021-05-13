# This service is started by MapAttributesExport.
module Api
  module V3
    class MapAttributesCartoUpload
      # @param carto_name [String]
      # @param column_definitions [Hash] col_name => col_type
      # @param file_path [String]
      def initialize(carto_name, column_definitions, file_path)
        @carto_name = carto_name
        @backup_carto_name = carto_name + '_bkp'
        @column_definitions = column_definitions
        @file_path = file_path
      end

      def call
        setup
        make_public
        copy
        teardown
      end

      private

      # backs up current table, creates new table for copy
      def setup
        sql = [
          "DROP TABLE IF EXISTS #{@backup_carto_name}",
          "ALTER TABLE IF EXISTS #{@carto_name} RENAME TO #{@backup_carto_name}",
          create_table_sql,
          "SELECT CDB_CartodbfyTable('#{org_name}', '#{@carto_name}')"
        ].join(';')
        # presumably this happens in a transaction
        carto_sql_post(sql)
      end

      def copy
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
      rescue
        # anything goes wrong in here, restore table from backup
        restore
        raise
      end

      def make_public
        show_uri = URI("https://sei-international.carto.com/u/#{org_name}/api/v1/viz/#{@carto_name}?#{auth}")
        request = Net::HTTP::Get.new(show_uri.path + '?' + show_uri.query)
        response = Net::HTTP.start(show_uri.host, show_uri.port, use_ssl: true) { |http| http.request(request) }
        # this will raise an exception and force sidekiq retry
        response.value unless response.is_a? Net::HTTPSuccess
        visualization = JSON.parse(response.body)
        visualization_id = visualization['id']

        update_uri = URI("https://sei-international.carto.com/u/#{org_name}/api/v1/viz/#{visualization_id}?#{auth}")
        request = Net::HTTP::Put.new(update_uri.path + '?' + update_uri.query)
        request['Content-Type'] = 'application/json'
        request.body = {id: visualization_id, privacy: 'PUBLIC'}.to_json
        response = Net::HTTP.start(update_uri.host, update_uri.port, use_ssl: true) { |http| http.request(request) }
        # this will raise an exception and force sidekiq retry
        response.value unless response.is_a? Net::HTTPSuccess
      end

      # drops backup table, indexes new table
      def teardown
        sql = [
          "DROP TABLE #{@backup_carto_name}",
          index_table_sql
        ].join(';')
        # presumably this happens in a transaction
        carto_sql_post(sql)
      end

      def restore
        sql = [
          "DROP TABLE IF EXISTS #{@carto_name}",
          "ALTER TABLE IF EXISTS #{@backup_carto_name} RENAME TO #{@carto_name}"
        ].join(';')
        # presumably this happens in a transaction
        carto_sql_post(sql)
      end

      def carto_sql_post(sql)
        uri = URI("https://#{host}/api/v2/sql?#{auth}&q=#{sql}")
        request = Net::HTTP::Post.new(uri.path + '?' + uri.query)
        # https://www.exceptionalcreatures.com/bestiary/Net/ReadTimeout.html
        response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
        # this will raise an exception and force sidekiq retry
        response.value unless response.is_a? Net::HTTPSuccess
      end

      def org_name
        ENV['CARTO_ACCOUNT']
      end

      def host
        "#{org_name}.carto.com"
      end

      def auth
        "api_key=#{ENV['CARTO_TOKEN']}"
      end

      def create_table_sql
        columns_with_types = @column_definitions.map { |name, type| "#{name} #{type}" }.join(', ')
        "CREATE TABLE #{@carto_name} (the_geom geometry, #{columns_with_types})"
      end

      def copy_sql
        column_names = @column_definitions.keys.join(', ')
        "COPY #{@carto_name} (#{column_names}) FROM STDIN WITH (FORMAT csv, HEADER true)"
      end

      def index_table_sql
        "CREATE INDEX #{@carto_name}_node_type_id_attribute_id_idx ON #{@carto_name} (node_type_id, attribute_id)"
      end
    end
  end
end
