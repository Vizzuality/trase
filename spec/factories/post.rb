FactoryBot.define do
  factory :post, class: 'Content::Post' do
    image { File.new("#{Rails.root}/spec/support/fixtures/blank.jpg") }
    category 'NEWS'
    state 1
  end
end
