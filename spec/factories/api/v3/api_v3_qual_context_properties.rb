FactoryBot.define do
  factory :api_v3_qual_context_property, class: "Api::V3::QualContextProperty" do
    association :qual, factory: :api_v3_qual
    association :context, factory: :api_v3_context
    tooltip_text { "Context specific tooltip text for QUAL" }
    display_name { "Context specific display name for QUAL" }
  end
end
