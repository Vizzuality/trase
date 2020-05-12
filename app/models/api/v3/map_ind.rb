# == Schema Information
#
# Table name: map_inds
#
#  id               :integer          not null, primary key
#  map_attribute_id :integer          not null
#  ind_id           :integer          not null
#
# Indexes
#
#  map_inds_map_attribute_id_ind_id_key  (map_attribute_id,ind_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (map_attribute_id => map_attributes.id) ON DELETE => cascade
#
module Api
  module V3
    class MapInd < YellowTable
      belongs_to :map_attribute
      belongs_to :ind

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_id, table_class: Api::V3::MapAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
