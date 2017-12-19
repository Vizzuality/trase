module Api
  module V3
    module Readonly
      class DownloadAttribute < BaseModel
        self.table_name = 'revamp.download_attributes_mv'
        self.primary_key = 'id'

        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        def self.refresh
          ActiveRecord::Base.connection.execute('REFRESH MATERIALIZED VIEW download_attributes_mv')
        end
      end
    end
  end
end
