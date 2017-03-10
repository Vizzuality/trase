# == Schema Information
#
# Table name: context_recolour_by
#
#  id             :integer          not null, primary key
#  context_id     :integer
#  attribute_id   :integer
#  attribute_type :string(5)
#  is_default     :boolean
#  is_disabled    :boolean
#

class ContextRecolourBy < ActiveRecord::Base
  self.table_name = 'context_recolour_by'


  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
end
