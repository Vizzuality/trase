# == Schema Information
#
# Table name: context_recolor_by
#
#  id                     :integer          not null, primary key
#  context_id             :integer
#  recolor_attribute_id   :integer          not null
#  recolor_attribute_type :enum
#  is_default             :boolean
#  is_disabled            :boolean
#  group_number           :integer          default("1")
#  position               :integer
#  legend_type            :string(55)
#  legend_color_theme     :string(55)
#  interval_count         :integer
#  min_value              :string(10)
#  max_value              :string(10)
#  divisor                :float
#  tooltip_text           :text
#

FactoryGirl.define do
  factory :context_recolor_by do
    is_default false
    is_disabled false
    legend_color_theme 'mock legend_color_theme'
    legend_type 'mock legend_type'
    position 0
  end
end
