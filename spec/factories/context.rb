# == Schema Information
#
# Table name: context
#
#  id                     :integer          not null, primary key
#  country_id             :integer
#  commodity_id           :integer
#  years                  :integer          is an Array
#  is_disabled            :boolean
#  is_default             :boolean
#  default_year           :integer
#  default_context_layers :string           is an Array
#  default_basemap        :string
#

FactoryBot.define do
  factory :context do
    country
    commodity
    years [2010, 2011, 2012, 2013, 2014, 2015]
  end

  factory :context_indicator do
    context
    association :indicator, factory: :quant
    position 0
  end
end
