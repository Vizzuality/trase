# == Schema Information
#
# Table name: context_attribute_properties_mv
#
#  id                               :bigint(8)        primary key
#  context_id(Reference to context) :bigint(8)
#  tooltip_text(Tooltip text)       :text
#  qual_id(Reference to qual)       :bigint(8)
#  ind_id(Reference to ind)         :bigint(8)
#  quant_id(Reference to quant)     :bigint(8)
#
# Indexes
#
#  context_attribute_properties_mv_id_idx  (context_id,qual_id,quant_id,ind_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class ContextAttributeProperty < Api::Readonly::BaseModel
        self.table_name = 'context_attribute_properties_mv'
      end
    end
  end
end
