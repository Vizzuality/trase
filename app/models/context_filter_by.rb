# == Schema Information
#
# Table name: context_filter_by
#
#  id           :integer          not null, primary key
#  context_id   :integer
#  node_type_id :integer
#  position     :integer
#

class ContextFilterBy < ActiveRecord::Base
    self.table_name = 'context_filter_by'


    belongs_to :node_type, :class_name => 'NodeType', :foreign_key => :node_type_id
    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
end
