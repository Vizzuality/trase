# == Schema Information
#
# Table name: map_attributes_v
#
#  id                                                    :integer          primary key
#  attribute_id(References the unique id in attributes.) :bigint(8)
#  context_id(References the context)                    :integer
#  map_attribute_group_id                                :integer
#  original_attribute_id(The attribute's original id)    :integer
#  position                                              :integer
#  is_disabled                                           :boolean
#  is_default                                            :boolean
#  years                                                 :integer          is an Array
#  dual_layer_buckets                                    :float            is an Array
#  single_layer_buckets                                  :float            is an Array
#  color_scale                                           :text
#  name(Display name of the ind/quant)                   :text
#  attribute_type(Type of the attribute (ind/quant))     :text
#  unit(Name of the attribute's unit)                    :text
#  description(Attribute's description)                  :text
#
module Api
  module V3
    module Readonly
      class MapAttribute < Api::Readonly::BaseModel
        self.table_name = 'map_attributes_v'

        belongs_to :map_attribute_group
      end
    end
  end
end
