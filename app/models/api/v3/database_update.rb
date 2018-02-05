module Api
  module V3
    class DatabaseUpdate < BaseModel
      STARTED = 'STARTED'.freeze
      FINISHED = 'FINISHED'.freeze
      FAILED = 'FAILED'.freeze

      validate :only_one_update_started
      scope :started, -> { where(status: STARTED) }

      def stats_to_s
        return '' unless stats.present?
        str = ''
        stats.each do |blue_table, blue_table_stats|
          str << "#{blue_table}\n"
          str << "  before: #{blue_table_stats[:before]}, after: #{blue_table_stats[:after]} (remote: #{blue_table_stats[:remote]})\n"
          blue_table_stats[:yellow_tables]&.each do |yellow_table, yellow_table_stats|
            str << "  #{yellow_table}\n"
            str << "    before: #{yellow_table_stats[:before]}, after: #{yellow_table_stats[:after]}\n"
          end
        end
        str
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
