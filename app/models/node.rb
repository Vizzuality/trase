# == Schema Information
#
# Table name: nodes
#
#  node_id                 :integer          not null, primary key
#  geo_id                  :text
#  main_node_id            :integer
#  name                    :text
#  node_type_id            :integer
#  is_domestic_consumption :boolean
#  is_unknown              :boolean
#

class Node < ActiveRecord::Base

  self.primary_key = :node_id

  belongs_to :node_type, :class_name => 'NodeType', :foreign_key => :node_type_id
  belongs_to :parent, :class_name => 'Node'
  has_many :children, :class_name => 'Node', :foreign_key => :parent_id
  has_many :node_quants, :class_name => 'NodeQuant', :foreign_key => :node_id
  has_many :node_quals, :class_name => 'NodeQual', :foreign_key => :node_id
  has_many :node_inds, :class_name => 'NodeInd', :foreign_key => :node_id

  def get_parents(parents=[])
    return parents.push(self) if self.parent.nil?
    parent.get_parents(parents.push(self))
  end
end
