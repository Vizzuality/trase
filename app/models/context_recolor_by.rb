# == Schema Information
#
# Table name: context_recolor_by
#
#  id                     :integer          not null, primary key
#  context_id             :integer
#  recolor_attribute_id   :integer
#  recolor_attribute_type :string(5)
#  is_default             :boolean
#  is_disabled            :boolean
#  group_number           :integer          default("1")
#  position               :integer
#  legend_type            :string(55)
#  legend_color_theme     :string(55)
#  interval_count         :integer
#  min_value              :string(10)
#  max_value              :string(10)
#

class ContextRecolorBy < ActiveRecord::Base
  self.table_name = 'context_recolor_by'


  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
  belongs_to :recolor_attribute, polymorphic: true
end
