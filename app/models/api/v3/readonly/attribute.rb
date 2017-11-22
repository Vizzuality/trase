module Api
  module V3
    module Readonly
      class Attribute < BaseModel
        self.table_name = 'revamp.attributes_mv'
        self.primary_key = 'id'
      end
    end
  end
end
