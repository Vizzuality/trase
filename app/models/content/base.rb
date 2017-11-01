module Content
  class Base < ActiveRecord::Base
    self.abstract_class = true

    establish_connection :content
  end
end
