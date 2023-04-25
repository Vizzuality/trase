FactoryBot.define do
  factory :testimonial, class: "Content::Testimonial" do
    quote { "Terrible" }
    author_name { "Grumpy" }
    author_title { "Mr" }
    image { File.new("#{Rails.root}/spec/support/fixtures/blank.jpg") }
  end
end
