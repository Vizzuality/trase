# == Schema Information
#
# Table name: inds
#
#  ind_id                   :integer          not null, primary key
#  name                     :text
#  unit                     :text
#  unit_type                :text
#  tooltip_text             :text
#  frontend_name            :text
#  place_factsheet          :boolean
#  actor_factsheet          :boolean
#  place_factsheet_tabular  :boolean
#  actor_factsheet_tabular  :boolean
#  place_factsheet_temporal :boolean
#  actor_factsheet_temporal :boolean
#  tooltip                  :boolean
#

class Ind < ActiveRecord::Base
  include Indicator

  self.primary_key = :ind_id

  has_many :node_inds, class_name: 'NodeInd', foreign_key: :ind_id
  has_many :flow_inds, class_name: 'FlowInd', foreign_key: :ind_id
  has_many :context_layers, as: :layer_attribute
  has_many :context_recolor_bies, as: :recolor_attribute
  has_many :context_resize_bies, as: :resize_attribute
  has_many :context_indicators, as: :indicator
end
