require 'active_support/concern'

module Api
  module Private
    module OperationStatus
      extend ActiveSupport::Concern

      QUEUED = 'QUEUED'.freeze
      STARTED = 'STARTED'.freeze
      FINISHED = 'FINISHED'.freeze
      FAILED = 'FAILED'.freeze

      included do
        scope :started_or_queued, -> { where(status: [STARTED, QUEUED]) }
        scope :finished, -> { where(status: FINISHED) }
      end

      def finished_at
        [FINISHED, FAILED].include?(status) && updated_at || nil
      end

      def start!
        update_columns(
          status: STARTED,
          updated_at: current_time_from_proper_timezone
        )
      end

      def started?
        status == STARTED
      end

      def fail!(error)
        update_columns(
          status: FAILED,
          error: error.message,
          updated_at: current_time_from_proper_timezone
        )
      end

      def failed?
        status == FAILED
      end

      def finish!
        update_columns(
          status: FINISHED,
          updated_at: current_time_from_proper_timezone
        )
      end

      def finished?
        status == FINISHED
      end
    end
  end
end
