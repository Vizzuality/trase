# == Schema Information
#
# Table name: context_layer
#
#  id                     :integer          not null
#  layer_attribute_id     :integer          not null
#  layer_attribute_type   :enum
#  context_id             :integer
#  position               :integer
#  bucket_3               :float            is an Array
#  bucket_5               :float            is an Array
#  context_layer_group_id :integer
#  is_default             :boolean          default("false")
#  color_scale            :string
#  years                  :integer          is an Array
#  aggregate_method       :string
#  enabled                :boolean          default("true"), not null
#

class ContextLayer < ActiveRecord::Base
    self.table_name = 'context_layer'


    belongs_to :context_layer_group, :class_name => 'ContextLayerGroup', :foreign_key => :context_layer_group_id
    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    belongs_to :layer_attribute, polymorphic: true
end
