# == Schema Information
#
# Table name: country_attribute_properties_mv
#
#  id                               :bigint(8)        primary key
#  country_id(Reference to country) :bigint(8)
#  tooltip_text(Tooltip text)       :text
#  qual_id(Reference to qual)       :bigint(8)
#  ind_id(Reference to ind)         :bigint(8)
#  quant_id(Reference to quant)     :bigint(8)
#
# Indexes
#
#  country_attribute_properties_mv_idx  (id,country_id,qual_id,quant_id,ind_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class CountryAttributeProperty < Api::Readonly::BaseModel
        self.table_name = 'country_attribute_properties_mv'
      end
    end
  end
end
