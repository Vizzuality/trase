# == Schema Information
#
# Table name: recolor_by_inds
#
#  id                      :integer          not null, primary key
#  recolor_by_attribute_id :integer          not null
#  ind_id                  :integer          not null
#
# Indexes
#
#  recolor_by_inds_recolor_by_attribute_id_ind_id_key  (recolor_by_attribute_id,ind_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (recolor_by_attribute_id => recolor_by_attributes.id) ON DELETE => cascade
#
module Api
  module V3
    class RecolorByInd < YellowTable
      belongs_to :recolor_by_attribute
      belongs_to :ind

      def self.yellow_foreign_keys
        [
          {name: :recolor_by_attribute_id, table_class: Api::V3::RecolorByAttribute}
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
