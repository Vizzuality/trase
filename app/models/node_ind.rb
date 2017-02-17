# == Schema Information
#
# Table name: node_inds
#
#  node_id :integer
#  ind_id  :integer
#  year    :integer
#  value   :float
#

class NodeInd < ActiveRecord::Base


  belongs_to :node, :class_name => 'Node', :foreign_key => :node_id
  belongs_to :ind, :class_name => 'Ind', :foreign_key => :ind_id
end
