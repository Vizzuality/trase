FactoryGirl.define do
  factory :country do
    sequence :iso2 { |n| ('AA'..'ZZ').to_a[n] }
    name { iso2 + ' COUNTRY'}
  end
end
