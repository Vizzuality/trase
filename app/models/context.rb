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


    belongs_to :commodity, :class_name => 'Commodity', :foreign_key => :commodity_id
    has_many :context_recolor_bies, :class_name => 'ContextRecolorBy'
    has_many :context_resize_bies, :class_name => 'ContextResizeBy'
    has_many :context_filter_bies, :class_name => 'ContextFilterBy'
    has_many :facts, :class_name => 'Fact'
    has_many :layers, :class_name => 'Layer'
    has_many :flows, :class_name => 'Flow'
    has_many :context_nodes, :class_name => 'ContextNode'
    belongs_to :country, :class_name => 'Country', :foreign_key => :country_id
end
