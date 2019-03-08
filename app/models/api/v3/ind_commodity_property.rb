# == Schema Information
#
# Table name: ind_commodity_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  commodity_id :bigint(8)
#  ind_id       :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_ind_commodity_properties_on_commodity_id  (commodity_id)
#  index_ind_commodity_properties_on_ind_id        (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id)
#  fk_rails_...  (ind_id => inds.id)
#

module Api
  module V3
    class IndCommodityProperty < ApplicationRecord
      belongs_to :commodity
      belongs_to :ind

      after_commit :refresh_dependents

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end
    end
  end
end
