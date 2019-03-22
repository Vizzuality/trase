# == Schema Information
#
# Table name: country_attribute_properties_mv
#
#  id           :bigint(8)        primary key
#  country_id   :bigint(8)
#  tooltip_text :text
#  qual_id      :bigint(8)
#  ind_id       :bigint(8)
#  quant_id     :bigint(8)
#
# Indexes
#
#  index_country_attribute_properties_mv_id  (id,country_id,qual_id,quant_id,ind_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class CountryAttributeProperty < Api::V3::Readonly::BaseModel
        self.table_name = 'country_attribute_properties_mv'
      end
    end
  end
end
