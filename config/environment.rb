# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

Api::V3::RefreshDependencies.instance.classes_with_dependents.each do |class_with_dependents|
  class_with_dependents.include(Api::V3::RefreshDependents)
end
