# == Schema Information
#
# Table name: layer_group
#
#  id   :integer          not null, primary key
#  name :text
#

class LayerGroup < ActiveRecord::Base
  self.table_name = 'layer_group'


end
