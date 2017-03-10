# == Schema Information
#
# Table name: node_quants
#
#  node_id  :integer
#  quant_id :integer
#  year     :integer
#  value    :float
#

class NodeQuant < ActiveRecord::Base



    belongs_to :node, :class_name => 'Node', :foreign_key => :node_id
    belongs_to :quant, :class_name => 'Quant', :foreign_key => :quant_id
end
