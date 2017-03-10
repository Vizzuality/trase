# == Schema Information
#
# Table name: quals
#
#  qual_id                  :integer          not null, primary key
#  name                     :text
#  tooltip                  :boolean
#  place_factsheet          :boolean
#  actor_factsheet          :boolean
#  place_factsheet_tabular  :boolean
#  actor_factsheet_tabular  :boolean
#  place_factsheet_temporal :boolean
#  actor_factsheet_temporal :boolean
#  frontend_name            :text
#

class Qual < ActiveRecord::Base

    self.primary_key = :qual_id

    has_many :node_quals, :class_name => 'NodeQual', :foreign_key => :qual_id
    has_many :flow_quals, :class_name => 'FlowQual', :foreign_key => :qual_id
    has_many :layers, as: :layer_attribute
    has_many :context_recolour_bies, as: :recolour_attribute
    has_many :context_resize_bies, as: :resize_attribute
end
