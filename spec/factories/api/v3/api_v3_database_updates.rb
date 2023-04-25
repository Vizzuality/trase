FactoryBot.define do
  factory :api_v3_database_update, class: "Api::V3::DatabaseUpdate" do
    status { "STARTED" }
  end
end
