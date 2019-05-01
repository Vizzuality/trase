# == Schema Information
#
# Table name: chart_quals
#
#  id                 :integer          not null, primary key
#  chart_attribute_id :integer          not null
#  qual_id            :integer          not null
#
# Indexes
#
#  chart_quals_chart_attribute_id_qual_id_key  (chart_attribute_id,qual_id) UNIQUE
#  index_chart_quals_on_chart_attribute_id     (chart_attribute_id)
#  index_chart_quals_on_qual_id                (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (chart_attribute_id => chart_attributes.id) ON DELETE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class ChartQual < YellowTable
      belongs_to :chart_attribute
      belongs_to :qual

      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::ChartAttribute}
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
