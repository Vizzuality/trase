# == Schema Information
#
# Table name: commodity_attribute_properties_mv
#
#  id                                   :bigint(8)        primary key
#  commodity_id(Reference to commodity) :bigint(8)
#  tooltip_text(Tooltip text)           :text
#  qual_id(Reference to qual)           :bigint(8)
#  ind_id(Reference to ind)             :bigint(8)
#  quant_id(Reference to quant)         :bigint(8)
#
# Indexes
#
#  commodity_attribute_properties_mv_id_idx  (id,commodity_id,qual_id,quant_id,ind_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class CommodityAttributeProperty < Api::Readonly::BaseModel
        self.table_name = 'commodity_attribute_properties_mv'
      end
    end
  end
end
