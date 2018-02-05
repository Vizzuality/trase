module Api
  module V3
    module Readonly
      class DownloadFlow < Api::V3::Readonly::BaseModel
        self.table_name = 'revamp.download_flows_mv'
        self.primary_key = 'id'

        def self.refresh(options = {})
          unless options[:skip_flow_paths]
            Scenic.database.refresh_materialized_view(
              'revamp.flow_paths_mv', concurrently: false
            )
          end
          Scenic.database.refresh_materialized_view(table_name, concurrently: false)
        end

        # this materialized view takes a long time to refresh
        def self.refresh_later(options = {})
          DownloadFlowsRefreshWorker.perform_async(options)
        end
      end
    end
  end
end
