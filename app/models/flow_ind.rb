# == Schema Information
#
# Table name: flow_inds
#
#  flow_id :integer
#  ind_id  :integer
#  value   :float
#

class FlowInd < ActiveRecord::Base


  belongs_to :flow, :class_name => 'Flow', :foreign_key => :flow_id
  belongs_to :ind, :class_name => 'Ind', :foreign_key => :ind_id
end
