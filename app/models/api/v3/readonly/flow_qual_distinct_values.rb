# == Schema Information
#
# Table name: flow_qual_distinct_values_mv
#
#  commodity_id    :integer
#  country_id      :integer
#  context_id      :integer
#  qual_id         :integer
#  distinct_values :text             is an Array
#
# Indexes
#
#  flow_qual_distinct_values_mv_context_id_qual_id_idx  (context_id,qual_id) UNIQUE
#
# This materialised view does not depend on any yellow tables.
# It should only be refreshed once per data import.
module Api
  module V3
    module Readonly
      class FlowQualDistinctValues < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = "flow_qual_distinct_values_mv"
      end
    end
  end
end
