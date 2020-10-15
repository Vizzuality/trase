class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.dependent_classes
    Api::V3::RefreshDependencies.instance.dependent_classes(self)
  end
end
