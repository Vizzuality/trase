# == Schema Information
#
# Table name: node_types
#
#  node_type_id :integer          not null, primary key
#  node_type    :text
#

class NodeType < ActiveRecord::Base
  self.primary_key = :node_type_id

  has_many :context_filter_bies, :class_name => 'ContextFilterBy', :foreign_key => :node_type_id
  has_many :nodes, :class_name => 'Node', :foreign_key => :node_type_id
  has_many :context_nodes, :class_name => 'ContextNode', :foreign_key => :node_type_id

  BIOME = 'BIOME'
  STATE = 'STATE'
  LOGISTICS_HUB = 'LOGISTICS HUB'
  MUNICIPALITY = 'MUNICIPALITY'
  EXPORTER = 'EXPORTER'
  PORT = 'PORT'
  IMPORTER = 'IMPORTER'
  COUNTRY = 'COUNTRY'
  TRADER = 'TRADER'
end
