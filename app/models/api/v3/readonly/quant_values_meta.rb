# == Schema Information
#
# Table name: quant_values_meta_mv
#
#  quant_id    :integer
#  node_values :jsonb
#  flow_values :jsonb
#
# Indexes
#
#  quant_values_meta_mv_quant_id_idx  (quant_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class QuantValuesMeta < Api::Readonly::BaseModel
        self.table_name = 'quant_values_meta_mv'

        belongs_to :quant
      end
    end
  end
end
