# This service is startted by MapAttributesExport.
module Api
  module V3
    class MapAttributesCartoSync
      def initialize(carto_name)
        @carto_name = carto_name
      end

      def call
        # get list of current synchronisations from Carto
        list = sync_tables_list
        # find the one we need by name
        sync = list.find { |s| s['name'] == @carto_name }
        return unless sync

        # force sync
        force_sync(sync['id'])
      end

      private

      def host
        "#{ENV['CARTO_ACCOUNT']}.carto.com"
      end

      def auth
        "api_key=#{ENV['CARTO_TOKEN']}"
      end

      def sync_tables_list
        uri = URI("https://#{host}/api/v1/synchronizations/?#{auth}")
        request = Net::HTTP::Get.new(uri.path + '?' + uri.query)
        response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
        data = JSON.parse(response.body)
        data['synchronizations']
      end

      def force_sync(import_id)
        uri = URI("https://#{host}/api/v1/synchronizations/#{import_id}/sync_now?#{auth}")
        request = Net::HTTP::Put.new(uri.path + '?' + uri.query)
        request['Content-Type'] = 'application/json'
        request['Content-Length'] = 0
        Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
      end
    end
  end
end
