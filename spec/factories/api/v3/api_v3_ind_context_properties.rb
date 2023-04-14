FactoryBot.define do
  factory :api_v3_ind_context_property, class: "Api::V3::IndContextProperty" do
    association :ind, factory: :api_v3_ind
    association :context, factory: :api_v3_context
    tooltip_text { "Context specific tooltip text for IND" }
    display_name { "Context specific display name for IND" }
  end
end
