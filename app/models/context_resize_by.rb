# == Schema Information
#
# Table name: context_resize_by
#
#  id             :integer          not null, primary key
#  context_id     :integer
#  is_default     :boolean
#  is_disabled    :boolean
#  attribute_id   :integer
#  attribute_type :string(5)
#

class ContextResizeBy < ActiveRecord::Base
  self.table_name = 'context_resize_by'


  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
end
