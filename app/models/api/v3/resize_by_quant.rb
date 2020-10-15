# == Schema Information
#
# Table name: resize_by_quants
#
#  id                     :integer          not null, primary key
#  resize_by_attribute_id :integer          not null
#  quant_id               :integer          not null
#
# Indexes
#
#  resize_by_quants_quant_id_idx                         (quant_id)
#  resize_by_quants_resize_by_attribute_id_idx           (resize_by_attribute_id)
#  resize_by_quants_resize_by_attribute_id_quant_id_key  (resize_by_attribute_id,quant_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (resize_by_attribute_id => resize_by_attributes.id) ON DELETE => cascade
#
module Api
  module V3
    class ResizeByQuant < YellowTable
      belongs_to :resize_by_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :resize_by_attribute_id, table_class: Api::V3::ResizeByAttribute}
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
