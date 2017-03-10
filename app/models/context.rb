# == Schema Information
#
# Table name: context
#
#  id           :integer          not null, primary key
#  country_id   :integer
#  commodity_id :integer
#  years        :integer          is an Array
#  is_default   :boolean
#  default_year :integer
#

class Context < ActiveRecord::Base
  self.table_name = 'context'


  belongs_to :country, :class_name => 'Country', :foreign_key => :country_id
  belongs_to :commodity, :class_name => 'Commodity', :foreign_key => :commodity_id
  has_many :context_nodes, :class_name => 'ContextNode'
  has_many :flows, :class_name => 'Flow'
  has_many :context_resize_bies, :class_name => 'ContextResizeBy'
  has_many :facts, :class_name => 'Fact'
  has_many :context_recolour_bies, :class_name => 'ContextRecolourBy'
  has_many :layers, :class_name => 'Layer'
end
