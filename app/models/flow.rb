# == Schema Information
#
# Table name: flows
#
#  flow_id    :integer          not null, primary key
#  year       :integer
#  path       :integer          is an Array
#  context_id :integer
#

class Flow < ActiveRecord::Base

    self.primary_key = :flow_id

    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    has_many :flow_quants, :class_name => 'FlowQuant', :foreign_key => :flow_id
    has_many :flow_quals, :class_name => 'FlowQual', :foreign_key => :flow_id
    has_many :flow_inds, :class_name => 'FlowInd', :foreign_key => :flow_id
end
