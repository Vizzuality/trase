# == Schema Information
#
# Table name: nodes
#
#  node_id     :integer          not null, primary key
#  geo_id      :text
#  ttp_node_id :integer
#  name        :text
#  type        :text
#

class Node < ActiveRecord::Base

  self.primary_key = :node_id
  self.inheritance_column = :ruby_type
  has_many :node_inds, :class_name => 'NodeInd', :foreign_key => :node_id
  has_many :node_quals, :class_name => 'NodeQual', :foreign_key => :node_id
  has_many :node_quants, :class_name => 'NodeQuant', :foreign_key => :node_id
end
