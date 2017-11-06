module Api
  module V3
    class MAttribute < BaseModel
      self.table_name = 'attributes_mv'
      self.primary_key = 'id'
    end
  end
end