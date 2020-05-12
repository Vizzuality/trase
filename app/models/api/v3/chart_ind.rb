# == Schema Information
#
# Table name: chart_inds
#
#  id                 :integer          not null, primary key
#  chart_attribute_id :integer          not null
#  ind_id             :integer          not null
#
# Indexes
#
#  chart_inds_chart_attribute_id_ind_id_key  (chart_attribute_id,ind_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (chart_attribute_id => chart_attributes.id) ON DELETE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class ChartInd < YellowTable
      belongs_to :chart_attribute
      belongs_to :ind

      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::ChartAttribute}
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
