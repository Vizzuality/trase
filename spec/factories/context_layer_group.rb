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
  factory :context_layer_group do
    position 0
  end
end
