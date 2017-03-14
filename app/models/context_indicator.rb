# == Schema Information
#
# Table name: context_indicators
#
#  id                       :integer          not null, primary key
#  context_id               :integer          not null
#  indicator_attribute_id   :integer          not null
#  indicator_attribute_type :enum             not null
#  position                 :integer          not null
#

class ContextIndicator < ApplicationRecord
  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
  belongs_to :indicator,
    foreign_key: :indicator_attribute_id,
    foreign_type: :indicator_attribute_type,
    polymorphic: true
  validates :context, uniqueness: {scope: :indicator}
end
