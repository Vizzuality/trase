# == Schema Information
#
# Table name: quants
#
#  quant_id                 :integer          not null, primary key
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

class Quant < ActiveRecord::Base
  include Indicator

  self.primary_key = :quant_id

  has_many :node_quants, class_name: 'NodeQuant', foreign_key: :quant_id
  has_many :flow_quants, class_name: 'FlowQuant', foreign_key: :quant_id
  has_many :layers, as: :layer_attribute
  has_many :context_recolor_bies, as: :recolor_attribute
  has_many :context_resize_bies, as: :resize_attribute
  has_many :context_indicators, as: :indicator
end
