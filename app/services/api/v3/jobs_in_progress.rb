module Api
  module V3
    class JobsInProgress
      include Singleton

      # checks if there are any running or scheduled jobs
      def call(worker_class_name)
        ss = Sidekiq::ScheduledSet.new
        rs = Sidekiq::RetrySet.new
        qs = Sidekiq::Queue.new("default")

        [ss, rs, qs].any? { |s| s.any? { |j| (j.klass == worker_class_name) } }
      end
    end
  end
end
