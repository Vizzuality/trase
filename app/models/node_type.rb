# == Schema Information
#
# Table name: node_types
#
#  node_type_id  :integer          not null, primary key
#  node_type     :text
#  profile_type  :string
#  is_geo_column :boolean
#

class NodeType < ActiveRecord::Base
  self.primary_key = :node_type_id

  has_many :context_filter_bies, :class_name => 'ContextFilterBy', :foreign_key => :node_type_id
  has_many :nodes, :class_name => 'Node', :foreign_key => :node_type_id
  has_many :context_nodes, :class_name => 'ContextNode', :foreign_key => :node_type_id

  def self.node_index_for_type(context, node_type)
    ContextNode.joins(:node_type).
      where(context_id: context.id).
      where('node_types.node_type' => node_type).
      pluck(:column_position).first + 1
  end
end
