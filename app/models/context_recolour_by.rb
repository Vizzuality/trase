# == Schema Information
#
# Table name: context_recolour_by
#
#  id                      :integer          not null, primary key
#  context_id              :integer
#  recolour_attribute_id   :integer
#  recolour_attribute_type :string(5)
#  is_default              :boolean
#  is_disabled             :boolean
#  group_number            :integer          default("1")
#  position                :integer
#

class ContextRecolourBy < ActiveRecord::Base
  self.table_name = 'context_recolour_by'


  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
  belongs_to :recolour_attribute, polymorphic: true
end
