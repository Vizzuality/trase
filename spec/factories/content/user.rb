FactoryBot.define do
  factory :user, class: 'Content::User' do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'test123' }
    uid { |user| user.email }
    provider { 'email' }
  end
end
