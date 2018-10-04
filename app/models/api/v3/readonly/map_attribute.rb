# == Schema Information
#
# Table name: map_attributes_mv
#
#  id                     :integer          primary key
#  map_attribute_group_id :integer
#  position               :integer
#  dual_layer_buckets     :float            is an Array
#  single_layer_buckets   :float            is an Array
#  color_scale            :text
#  years                  :integer          is an Array
#  is_disabled            :boolean
#  is_default             :boolean
#  created_at             :datetime
#  updated_at             :datetime
#  attribute_id           :integer
#  name                   :text
#  attribute_type         :text
#  unit                   :text
#  description            :text
#  aggregate_method       :text
#  original_attribute_id  :integer
#  context_id             :integer
#
# Indexes
#
#  map_attributes_mv_context_id_is_disabled_idx                (context_id,is_disabled)
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
          Api::V3::Readonly::Attribute.refresh(options)
        end
      end
    end
  end
end
