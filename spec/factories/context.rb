FactoryGirl.define do
  factory :context do
    country
    commodity
  end

  factory :context_node do
    context
    node_type
    column_position 0
  end

  factory :context_indicator do
    context
    association :indicator, factory: :quant
    position 0
  end
end
