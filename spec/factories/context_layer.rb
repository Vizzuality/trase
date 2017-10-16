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

FactoryGirl.define do
  factory :context_layer do
    bucket_3 [5, 10]
    bucket_5 [1, 4, 6, 8]
    position 0
    color_scale 'blue'
    enabled true
  end
end
