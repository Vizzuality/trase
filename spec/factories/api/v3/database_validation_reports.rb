FactoryBot.define do
  factory :database_validation do
    report { "" }
    error_count { 1 }
    warning_count { 1 }
  end
end
