# == Schema Information
#
# Table name: context_layer_group
#
#  id       :integer          not null, primary key
#  name     :text
#  position :integer
#

class ContextLayerGroup < ActiveRecord::Base
    self.table_name = 'context_layer_group'


    has_many :context_layers, :class_name => 'ContextLayer'
end
