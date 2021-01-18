# == Schema Information
#
# Table name: quant_commodity_properties
#
#  id                                                                                                                                                                                                                            :bigint(8)        not null, primary key
#  tooltip_text(Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.)   :text             not null
#  commodity_id(Reference to commodity)                                                                                                                                                                                          :bigint(8)        not null
#  quant_id(Reference to quant)                                                                                                                                                                                                  :bigint(8)        not null
#  display_name(Commodity-specific display names are the third-most specific that can be defined after context and country-specific display names; in absence of a commodity-specific display name, a generic one will be used.) :text             not null
#
# Indexes
#
#  quant_commodity_properties_commodity_id_idx  (commodity_id)
#  quant_commodity_properties_quant_id_idx      (quant_id)
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
      validates :display_name, presence: true

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end
    end
  end
end
