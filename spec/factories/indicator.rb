FactoryGirl.define do
  factory :qual do
    name 'ZERO_DEFORESTATION'
  end

  factory :quant do
    name 'FOB'
    unit 'USD'
  end

  factory :ind do
    name 'FOREST_500'
    unit nil
  end
end
