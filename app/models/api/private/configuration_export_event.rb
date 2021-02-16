# == Schema Information
#
# Table name: configuration_export_events
#
#  id         :bigint(8)        not null, primary key
#  status     :text             default("QUEUED"), not null
#  jid        :text
#  started_by :text
#  error      :text
#  data       :json
#
module Api
  module Private
    class ConfigurationExportEvent < Api::V3::BaseModel
      include OperationStatus

      def finish!(data)
        update_columns(
          status: FINISHED,
          data: data,
          updated_at: current_time_from_proper_timezone
        )
      end
    end
  end
end
