FactoryBot.define do
  factory :api_v3_ind, class: "Api::V3::Ind" do
    sequence(:name) { |n| "ind #{n}" }
  end
end
