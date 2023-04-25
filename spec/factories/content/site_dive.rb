FactoryBot.define do
  factory :site_dive, class: "Content::SiteDive" do
    sequence(:title) { |n| "Site Dive #{n}" }
    description { "Description" }
    page_url { "http://example.com" }
  end
end
