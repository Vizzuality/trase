# == Schema Information
#
# Table name: context_layer
#
#  id                   :integer          not null, primary key
#  layer_attribute_id   :integer
#  layer_attribute_type :string(5)
#  context_id           :integer
#  position             :integer
#  bucket_3             :float            is an Array
#  bucket_5             :float            is an Array
#  context_layer_group_id       :integer
#  is_default           :boolean          default("false")
#

class ContextLayer < ActiveRecord::Base
    self.table_name = 'context_layer'


    belongs_to :context_layer_group, :class_name => 'ContextLayerGroup', :foreign_key => :context_layer_group_id
    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    belongs_to :layer_attribute, polymorphic: true
end
