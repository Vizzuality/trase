FactoryBot.define do
  factory :flow do
    context
    year 2015
    path []
  end

  factory :flow_ind do
    flow
    ind
    value 10
  end

  factory :flow_quant do
    flow
    quant
    value 10
  end

  factory :flow_qual do
    flow
    qual
    value 'yes'
  end
end
