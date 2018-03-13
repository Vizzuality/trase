module Api
  module V3
    module Readonly
      class MapAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'map_attributes_mv'

        belongs_to :map_attribute_group
      end
    end
  end
end
