# == Schema Information
#
# Table name: map_attributes_mv
#
#  id                                                       :integer          primary key
#  map_attribute_group_id                                   :integer
#  position                                                 :integer
#  dual_layer_buckets                                       :float            is an Array
#  single_layer_buckets                                     :float            is an Array
#  color_scale                                              :text
#  years                                                    :integer          is an Array
#  is_disabled                                              :boolean
#  is_default                                               :boolean
#  attribute_id(References the unique id in attributes_mv.) :bigint(8)
#  name(Display name of the ind/quant)                      :text
#  attribute_type(Type of the attribute (ind/quant))        :text
#  unit(Name of the attribute's unit)                       :text
#  description(Attribute's description)                     :text
#  aggregate_method(The method used to aggregate the data)  :text
#  original_attribute_id(The attribute's original id)       :integer
#  context_id(References the context)                       :integer
#
# Indexes
#
#  map_attributes_mv_context_id_is_disabled_idx                (context_id,is_disabled) WHERE (is_disabled IS FALSE)
#  map_attributes_mv_id_idx                                    (id) UNIQUE
#  map_attributes_mv_map_attribute_group_id_attribute_id_idx   (map_attribute_group_id,attribute_id)
#  map_attributes_mv_original_attribute_id_attribute_type_idx  (original_attribute_id,attribute_type)
#

module Api
  module V3
    module Readonly
      class MapAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'map_attributes_mv'

        belongs_to :map_attribute_group

        def self.refresh_dependencies(options = {})
          Api::V3::Readonly::Attribute.refresh(options.merge(skip_dependents: true))
        end
      end
    end
  end
end
