module Content
  class Base < ActiveRecord::Base
    self.abstract_class = true
    self.table_name_prefix = 'content.'
  end
end
