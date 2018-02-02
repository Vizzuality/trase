module Api
  module V3
    module Readonly
      class DownloadFlow < BaseModel
        self.table_name = 'revamp.download_flows_mv'
        self.primary_key = 'id'

        def self.refresh
          Scenic.database.refresh_materialized_view('revamp.flow_paths_mv', concurrently: false)
          Scenic.database.refresh_materialized_view(table_name, concurrently: false)
        end
      end
    end
  end
end
