# == Schema Information
#
# Table name: database_updates
#
#  id                                                                                        :bigint(8)        not null, primary key
#  stats(JSON structure with information on row counts for all tables before / after update) :json
#  jid(Job ID, filled in when update started using a background job processor)               :text
#  status(STARTED (only one at a time), FINISHED or FAILED)                                  :text             default("STARTED"), not null
#  error(Exception message for failed updates)                                               :text
#  filename                                                                                  :text
#
# Indexes
#
#  database_updates_jid_key     (jid) UNIQUE
#  database_updates_status_idx  (status) UNIQUE WHERE (status = 'STARTED'::text)
#

module Api
  module V3
    class DatabaseUpdate < BaseModel
      STARTED = 'STARTED'.freeze
      FINISHED = 'FINISHED'.freeze
      FAILED = 'FAILED'.freeze

      S3_PREFIX = 'MAIN'.freeze # prefix within bucket

      validate :only_one_update_started
      scope :started, -> { where(status: STARTED) }

      def stats_to_ary
        return [] unless stats.present?

        ary = []
        elapsed_seconds = stats.delete('elapsed_seconds')
        elapsed_seconds&.map do |key, value|
          ary << "DURATION #{key}: #{value} seconds"
        end
        stats.each do |blue_table, blue_stats|
          b_line = "#{blue_table}: "
          b_line << blue_stats.except('yellow_tables').keys.map do |key|
            "#{key.upcase}: #{blue_stats[key]}"
          end.join(', ')
          ary << b_line
          blue_stats['yellow_tables']&.each do |yellow_table, yellow_stats|
            y_line = "#{yellow_table}: "
            y_line << yellow_stats.keys.map do |key|
              "#{key.upcase}: #{yellow_stats[key]}"
            end.join(', ')
            ary << y_line
          end
        end
        ary
      end

      def stats_to_s
        stats_to_ary.map { |line| "#{line}\n" }.join('')
      end

      def update_stats(stats)
        update_attribute(:stats, stats)
      end

      def finished_at
        [FINISHED, FAILED].include?(status) && updated_at || nil
      end

      def finished_with_error(error, stats)
        update_columns(
          status: FAILED,
          error: error.message,
          stats: stats,
          updated_at: current_time_from_proper_timezone
        )
      end

      def finished_with_success(stats)
        update_columns(
          status: FINISHED,
          stats: stats,
          updated_at: current_time_from_proper_timezone
        )
      end

      def self.last_successful_update
        where(status: FINISHED).order(:created_at).last
      end

      protected

      def started?
        status == STARTED
      end

      def only_one_update_started
        return unless started?

        matches = DatabaseUpdate.started
        matches = matches.where('id != ?', id) if persisted?
        errors.add(:started, 'cannot start another update') if matches.exists?
      end
    end
  end
end
