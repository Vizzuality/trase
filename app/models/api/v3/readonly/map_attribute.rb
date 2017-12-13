module Api
  module V3
    module Readonly
      class MapAttribute < BaseModel
        self.table_name = 'revamp.map_attributes_mv'
        self.primary_key = 'id'

        belongs_to :map_attribute_group

        def self.refresh
          ActiveRecord::Base.connection.execute('REFRESH MATERIALIZED VIEW map_attributes_mv')
        end
      end
    end
  end
end
