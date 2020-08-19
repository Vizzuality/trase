FactoryBot.define do
  factory :api_v3_context_property, class: 'Api::V3::ContextProperty' do
    association :context, factory: :api_v3_context
    default_basemap { 'satellite' }
    is_disabled { false }
    is_default { false }
    is_highlighted { false }
  end
end
