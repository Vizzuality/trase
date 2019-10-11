# == Schema Information
#
# Table name: flows_mv
#
#  id         :integer          primary key
#  context_id :integer
#  year       :integer
#  path       :integer          is an Array
#  jsonb_path :jsonb
#
# Indexes
#
#  flows_mv_context_id_idx  (context_id)
#  flows_mv_unique_idx      (id) UNIQUE
#  flows_mv_year_idx        (year)
#

module Api
  module V3
    module Readonly
      class Flow < Api::Readonly::BaseModel
        self.table_name = 'flows_mv'
        belongs_to :context
      end
    end
  end
end
