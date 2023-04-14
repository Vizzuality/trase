FactoryBot.define do
  factory :page, class: "Content::Page" do
    sequence(:name) { |n| "page-#{n}" }
    content { "# Title" }
  end
end
