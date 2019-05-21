# == Schema Information
#
# Table name: quant_commodity_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text             not null
#  commodity_id :bigint(8)        not null
#  quant_id     :bigint(8)        not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_quant_commodity_properties_on_commodity_id  (commodity_id)
#  index_quant_commodity_properties_on_quant_id      (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QuantCommodityProperty < YellowTable
      belongs_to :commodity
      belongs_to :quant

      validates :commodity, presence: true
      validates :quant, presence: true, uniqueness: {scope: :commodity}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end
    end
  end
end
