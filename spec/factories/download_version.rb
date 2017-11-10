FactoryBot.define do
  factory :download_version do
    symbol { |n| "1.#{n}" }
    current false
  end
end
