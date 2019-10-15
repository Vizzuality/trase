# == Schema Information
#
# Table name: qual_values_meta_mv
#
#  qual_id     :integer
#  node_values :jsonb
#  flow_values :jsonb
#
# Indexes
#
#  qual_values_meta_mv_qual_id_idx  (qual_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class QualValuesMeta < Api::Readonly::BaseModel
        self.table_name = 'qual_values_meta_mv'

        belongs_to :qual
      end
    end
  end
end
