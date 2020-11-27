# == Schema Information
#
# Table name: ind_values_meta_mv
#
#  ind_id      :integer
#  node_values :jsonb
#  flow_values :jsonb
#
# Indexes
#
#  ind_values_meta_mv_ind_id_idx  (ind_id) UNIQUE
#
module Api
  module V3
    module Readonly
      class IndValuesMeta < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = 'ind_values_meta_mv'

        belongs_to :ind
      end
    end
  end
end
