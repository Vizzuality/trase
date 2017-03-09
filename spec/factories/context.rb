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
end
