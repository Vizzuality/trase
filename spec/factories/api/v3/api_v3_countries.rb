FactoryBot.define do
  factory :api_v3_country, class: "Api::V3::Country" do
    sequence(:iso2) { |n| ("AA".."ZZ").to_a[n] }
    name { iso2 + " COUNTRY" }
    initialize_with {
      country = Api::V3::Country.where(iso2: iso2).first
      country || Api::V3::Country.create(iso2: iso2, name: name)
    }
  end
end
