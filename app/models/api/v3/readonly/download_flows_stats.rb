# == Schema Information
#
# Table name: download_flows_stats_mv
#
#  context_id     :integer
#  year           :integer
#  attribute_type :text
#  attribute_id   :integer
#  count          :bigint(8)
#
# Indexes
#
#  download_flows_stats_mv_id_idx  (context_id,year,attribute_type,attribute_id) UNIQUE
#
module Api
  module V3
    module Readonly
      class DownloadFlowsStats < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = "download_flows_stats_mv"
      end
    end
  end
end
