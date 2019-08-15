# == Schema Information
#
# Table name: download_flows
#
#  context_id     :integer
#  year           :integer
#  path           :integer          is an Array
#  jsonb_path     :jsonb
#  attribute_type :text
#  attribute_id   :integer
#  attribute_name :text
#  text_values    :text
#  sum            :decimal(, )
#  total          :text
#  sort           :text
#

# This class is not backed by a materialized view, but a partitioned table.
# It only needs to be refreshed once during the data import process.
# The intention is to use this table for downloads only.
module Api
  module V3
    module Readonly
      class DownloadFlow < Api::Readonly::BaseModel
        self.table_name = 'download_flows'

        class << self
          # @param options
          # @option options [Boolean] :skip_dependencies skip refreshing
          # @option options [Boolean] :skip_dependents skip refreshing
          # @option options [Boolean] :skip_precompute skip precomputing downloads
          def refresh_now(options = {})
            refresh_dependencies(options) unless options[:skip_dependencies]
            Api::V3::TablePartitions::CreatePartitionsForDownloadFlows.new.call
            after_refresh(options)
            refresh_dependents(options) unless options[:skip_dependents]
          end

          # @param options
          # @option options [Boolean] :skip_dependencies skip refreshing
          # @option options [Boolean] :skip_dependents skip refreshing
          # @option options [Boolean] :skip_precompute skip precomputing downloads
          def refresh_later(options = {})
            TablePartitionsWorker.perform_async(name, options)
          end

          protected

          def long_running?
            true
          end

          def refresh_dependencies(options = {})
            Api::V3::Readonly::Attribute.refresh(
              options.merge(skip_dependents: true, skip_dependencies: true)
            )
            Api::V3::Readonly::DownloadAttribute.refresh(
              options.merge(skip_dependents: true, skip_dependencies: true)
            )
            Api::V3::Readonly::Flow.refresh(options.merge(skip_dependents: true))
          end

          def after_refresh(options = {})
            Api::V3::Readonly::DownloadFlowsStats.refresh(
              options.merge(skip_dependencies: true)
            )
            Api::V3::Download::PrecomputedDownload.clear
            return if options[:skip_precompute]

            Api::V3::Download::PrecomputedDownload.refresh_later
          end
        end
      end
    end
  end
end
