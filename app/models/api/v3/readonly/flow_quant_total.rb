# == Schema Information
#
# Table name: flow_quant_totals_mv
#
#  commodity_id :integer
#  country_id   :integer
#  context_id   :integer
#  quant_id     :integer
#  year         :integer
#  total        :float
#
# Indexes
#
#  flow_quant_totals_mv_commodity_id_country_id_quant_id_idx  (commodity_id,country_id,quant_id) UNIQUE
#
# This materialised view does not depend on any yellow tables.
# It should only be refreshed once per data import.
module Api
  module V3
    module Readonly
      class FlowQuantTotal < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = 'flow_quant_totals_mv'

        scope :with_attribute_id, -> {
          select('flow_quant_totals_mv.*, attributes.id AS attribute_id').
            joins("JOIN attributes ON original_type = 'Quant' AND original_id = quant_id")
        }

        def attribute_id
          attributes['attribute_id']
        end
      end
    end
  end
end
