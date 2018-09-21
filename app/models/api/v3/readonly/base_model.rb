module Api
  module V3
    module Readonly
      class BaseModel < Api::V3::BaseModel
        def readonly?
          true
        end

        def self.refresh(options = {})
          concurrently = options[:concurrently] || true
          concurrently = false unless IsMviewPopulated.new(table_name).call

          Scenic.database.refresh_materialized_view(
            table_name,
            concurrently: concurrently
          )
        end
      end
    end
  end
end
