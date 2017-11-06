# == Schema Information
#
# Table name: flow_quals
#
#  flow_id :integer
#  qual_id :integer
#  value   :text
#

class FlowQual < ActiveRecord::Base
  belongs_to :qual, class_name: 'Qual', foreign_key: :qual_id
  belongs_to :flow, class_name: 'Flow', foreign_key: :flow_id
end
