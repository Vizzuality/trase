module Api
  module V3
    class BaseModel < ActiveRecord::Base
      include Api::V3::Import::Helpers
      self.abstract_class = true

      establish_connection DB_REVAMP
    end
  end
end
