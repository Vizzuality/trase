# == Schema Information
#
# Table name: flows
#
#  flow_id    :integer          not null, primary key
#  com_id     :integer
#  country_id :integer
#  year       :integer
#  path       :integer          is an Array
#

class Flow < ActiveRecord::Base

  self.primary_key = :flow_id

  has_many :flow_inds, :class_name => 'FlowInd', :foreign_key => :flow_id
  has_many :flow_quals, :class_name => 'FlowQual', :foreign_key => :flow_id
  has_many :flow_quants, :class_name => 'FlowQuant', :foreign_key => :flow_id
  belongs_to :commodity, :class_name => 'Commodity', :foreign_key => :com_id
  belongs_to :country, :class_name => 'Country', :foreign_key => :country_id
end
