# == Schema Information
#
# Table name: layer
#
#  id             :integer          not null, primary key
#  attribute_id   :integer
#  attribute_type :string(5)
#  context_id     :integer
#  group_name     :text
#  position       :integer
#

class Layer < ActiveRecord::Base
  self.table_name = 'layer'


  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
end
