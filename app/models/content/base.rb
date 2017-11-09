module Content
  class Base < ActiveRecord::Base
    self.abstract_class = true

    establish_connection DB_CONTENT
  end
end
