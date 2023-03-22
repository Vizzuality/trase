module Content
  class Base < ApplicationRecord
    self.abstract_class = true
    self.table_name_prefix = "content."
  end
end
