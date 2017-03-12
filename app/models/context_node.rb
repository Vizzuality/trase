# == Schema Information
#
# Table name: context_nodes
#
#  id              :integer          not null, primary key
#  context_id      :integer
#  column_group    :integer
#  column_position :integer
#  is_default      :boolean
#  node_type_id    :integer
#

class ContextNode < ActiveRecord::Base



    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    belongs_to :node_type, :class_name => 'NodeType', :foreign_key => :node_type_id
end
