# == Schema Information
#
# Table name: context
#
#  id                     :integer          not null, primary key
#  country_id             :integer
#  commodity_id           :integer
#  years                  :integer          is an Array
#  is_disabled            :boolean
#  is_default             :boolean
#  default_year           :integer
#  default_context_layers :string           is an Array
#  default_basemap        :string
#

class Context < ActiveRecord::Base
    self.table_name = 'context'


    belongs_to :commodity, :class_name => 'Commodity', :foreign_key => :commodity_id
    has_many :context_recolor_bies, :class_name => 'ContextRecolorBy'
    has_many :context_resize_bies, :class_name => 'ContextResizeBy'
    has_many :context_filter_bies, :class_name => 'ContextFilterBy'
    has_many :facts, :class_name => 'Fact'
    has_many :context_layers, :class_name => 'ContextLayer'
    has_many :flows, :class_name => 'Flow'
    has_many :context_nodes, :class_name => 'ContextNode'
    belongs_to :country, :class_name => 'Country', :foreign_key => :country_id
end
