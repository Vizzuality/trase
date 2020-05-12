# == Schema Information
#
# Table name: map_quants
#
#  id               :integer          not null, primary key
#  map_attribute_id :integer          not null
#  quant_id         :integer          not null
#
# Indexes
#
#  map_quants_map_attribute_id_idx           (map_attribute_id)
#  map_quants_map_attribute_id_quant_id_key  (map_attribute_id,quant_id) UNIQUE
#  map_quants_quant_id_idx                   (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (map_attribute_id => map_attributes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class MapQuant < YellowTable
      belongs_to :map_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_id, table_class: Api::V3::MapAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
