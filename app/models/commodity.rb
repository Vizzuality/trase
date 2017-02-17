# == Schema Information
#
# Table name: commodities
#
#  com_id :integer          not null, primary key
#  name   :text
#

class Commodity < ActiveRecord::Base

  self.primary_key = :com_id

  has_many :flows, :class_name => 'Flow', :foreign_key => :com_id
end
