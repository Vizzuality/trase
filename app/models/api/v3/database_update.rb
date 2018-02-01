module Api
  module V3
    class DatabaseUpdate < BaseModel
      STARTED = 'STARTED'.freeze
      FINISHED = 'FINISHED'.freeze
      FAILED = 'FAILED'.freeze

      validate :only_one_update_started
      scope :started, -> { where(status: STARTED) }

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
