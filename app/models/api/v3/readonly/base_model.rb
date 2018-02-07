module Api
  module V3
    module Readonly
      class BaseModel < Api::V3::BaseModel
        def readonly?
          true
        end

        def self.refresh
          Scenic.database.refresh_materialized_view(table_name, concurrently: false)
        end
      end
    end
  end
end
