# == Schema Information
#
# Table name: layer
#
#  id                   :integer          not null, primary key
#  layer_attribute_id   :integer
#  layer_attribute_type :string(5)
#  context_id           :integer
#  position             :integer
#  bucket_3             :float            is an Array
#  bucket_5             :float            is an Array
#  layer_group_id       :integer
#  is_default           :boolean          default("false")
#

class Layer < ActiveRecord::Base
    self.table_name = 'layer'


    belongs_to :layer_group, :class_name => 'LayerGroup', :foreign_key => :layer_group_id
    belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
    belongs_to :layer_attribute, polymorphic: true
end
