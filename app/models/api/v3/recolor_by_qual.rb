# == Schema Information
#
# Table name: recolor_by_quals
#
#  id                      :integer          not null, primary key
#  recolor_by_attribute_id :integer          not null
#  qual_id                 :integer          not null
#
# Indexes
#
#  recolor_by_quals_recolor_by_attribute_id_qual_id_key  (recolor_by_attribute_id,qual_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (recolor_by_attribute_id => recolor_by_attributes.id) ON DELETE => cascade
#
module Api
  module V3
    class RecolorByQual < YellowTable
      belongs_to :recolor_by_attribute
      belongs_to :qual

      def self.yellow_foreign_keys
        [
          {name: :recolor_by_attribute_id, table_class: Api::V3::RecolorByAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
