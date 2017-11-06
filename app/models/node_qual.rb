# == Schema Information
#
# Table name: node_quals
#
#  node_id :integer
#  qual_id :integer
#  year    :integer
#  value   :text
#

class NodeQual < ActiveRecord::Base
  belongs_to :qual, class_name: 'Qual', foreign_key: :qual_id
  belongs_to :node, class_name: 'Node', foreign_key: :node_id
end
