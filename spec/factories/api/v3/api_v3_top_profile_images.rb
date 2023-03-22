FactoryBot.define do
  factory :api_v3_top_profile_image, class: "Api::V3::TopProfileImage" do
    association :commodity, factory: :api_v3_commodity
    profile_type { "actor" }
    image { File.new("#{Rails.root}/spec/support/fixtures/blank.jpg") }
  end
end
