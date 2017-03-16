# == Schema Information
#
# Table name: context
#
#  id           :integer          not null, primary key
#  country_id   :integer
#  commodity_id :integer
#  years        :integer          is an Array
#  is_disabled  :boolean
#  is_default   :boolean
#  default_year :integer
#

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
