# == Schema Information
#
# Table name: commodity_attribute_properties_mv
#
#  id           :bigint(8)        primary key
#  commodity_id :bigint(8)
#  tooltip_text :text
#  qual_id      :bigint(8)
#  ind_id       :bigint(8)
#  quant_id     :bigint(8)
#
# Indexes
#
#  index_commodity_attribute_properties_mv_id  (id,commodity_id,qual_id,quant_id,ind_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class CommodityAttributeProperty < Api::V3::Readonly::BaseModel
        self.table_name = 'commodity_attribute_properties_mv'
      end
    end
  end
end
