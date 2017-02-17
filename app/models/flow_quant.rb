# == Schema Information
#
# Table name: flow_quants
#
#  flow_id  :integer
#  quant_id :integer
#  value    :float
#

class FlowQuant < ActiveRecord::Base


  belongs_to :flow, :class_name => 'Flow', :foreign_key => :flow_id
  belongs_to :quant, :class_name => 'Quant', :foreign_key => :quant_id
end
