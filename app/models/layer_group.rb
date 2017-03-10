# == Schema Information
#
# Table name: layer_group
#
#  id       :integer          not null, primary key
#  name     :text
#  position :integer
#

class LayerGroup < ActiveRecord::Base
    self.table_name = 'layer_group'


    has_many :layers, :class_name => 'Layer'
end
