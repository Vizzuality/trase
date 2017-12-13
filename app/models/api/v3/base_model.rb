module Api
  module V3
    class BaseModel < ActiveRecord::Base
      self.abstract_class = true

      def self.table_name_prefix
        'revamp.'
      end
    end
  end
end
