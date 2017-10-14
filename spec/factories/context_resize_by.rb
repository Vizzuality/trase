# == Schema Information
#
# Table name: context_resize_by
#
#  id                    :integer          not null, primary key
#  context_id            :integer
#  is_default            :boolean
#  is_disabled           :boolean
#  resize_attribute_id   :integer          not null
#  resize_attribute_type :enum
#  group_number          :integer          default("1")
#  position              :integer
#  tooltip_text          :text
#

FactoryGirl.define do
  factory :context_resize_by do
    is_default false
    is_disabled false
    position 0
  end
end
