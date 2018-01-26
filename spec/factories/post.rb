FactoryBot.define do
  factory :post, class: 'Content::Post' do
    sequence(:title) { |n| "News Item #{n}" }
    title_color '#000000'
    image { File.new("#{Rails.root}/spec/support/fixtures/blank.jpg") }
    post_url 'http://example.com'
    category 'NEWS'
    state 1
  end
end
