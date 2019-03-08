# == Schema Information
#
# Table name: qual_commodity_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  commodity_id :bigint(8)
#  qual_id      :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_qual_commodity_properties_on_commodity_id  (commodity_id)
#  index_qual_commodity_properties_on_qual_id       (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id)
#  fk_rails_...  (qual_id => quals.id)
#

module Api
  module V3
    class QualCommodityProperty < ApplicationRecord
      belongs_to :commodity
      belongs_to :qual

      after_commit :refresh_dependents

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end
    end
  end
end
