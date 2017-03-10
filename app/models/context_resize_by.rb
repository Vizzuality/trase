# == Schema Information
#
# Table name: context_resize_by
#
#  id                    :integer          not null, primary key
#  context_id            :integer
#  is_default            :boolean
#  is_disabled           :boolean
#  resize_attribute_id   :integer
#  resize_attribute_type :string(5)
#  group_number          :integer          default("1")
#  position              :integer
#

class ContextResizeBy < ActiveRecord::Base
    self.table_name = 'context_resize_by'


    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    belongs_to :resize_attribute, polymorphic: true
end
