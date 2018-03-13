# == Schema Information
#
# Table name: database_updates
#
#  id         :integer          not null, primary key
#  stats      :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  jid        :text
#  status     :text             default("STARTED"), not null
#  error      :text
#
# Indexes
#
#  database_updates_jid_key          (jid) UNIQUE
#  index_database_updates_on_status  (status) UNIQUE
#

module Api
  module V3
    class DatabaseUpdate < BaseModel
      STARTED = 'STARTED'.freeze
      FINISHED = 'FINISHED'.freeze
      FAILED = 'FAILED'.freeze

      validate :only_one_update_started
      scope :started, -> { where(status: STARTED) }

      def stats_to_ary
        return [] unless stats.present?
        ary = []
        stats.each do |blue_table, blue_stats|
          b_line = "#{blue_table}: "
          b_line << "REMOTE: #{blue_stats['remote']}, "
          b_line << "BEFORE: #{blue_stats['before']}, "
          b_line << "AFTER: #{blue_stats['after']}"
          ary << b_line
          blue_stats[:yellow_tables]&.each do |yellow_table, yellow_stats|
            y_line = "#{yellow_table}: "
            y_line << "BEFORE: #{yellow_stats['before']}, "
            y_line << "AFTER: #{yellow_stats['after']} "
            ary << y_line
          end
        end
        ary
      end

      def stats_to_s
        stats_to_ary.join("\n")
      end

      def finished_at
        [FINISHED, FAILED].include?(status) && updated_at || nil
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
