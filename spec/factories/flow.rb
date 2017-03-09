FactoryGirl.define do
  factory :flow do
    context
    year 2015
    path []
  end

  factory :flow_quant do
    flow
    quant
    value 10
  end
end
