FactoryBot.define do
  factory :post, class: "Content::Post" do
    sequence(:title) { |n| "News Item #{n}" }
    image { Rack::Test::UploadedFile.new "#{Rails.root}/spec/support/fixtures/blank.jpg", "image/jpg" }
    post_url { "http://example.com" }
    category { "NEWS" }
    state { 1 }
  end
end
