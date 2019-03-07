module Api
  module V3
    module Import
      module Timer
        def self.with_timer
          starting = Process.clock_gettime(Process::CLOCK_MONOTONIC)
          yield
          ending = Process.clock_gettime(Process::CLOCK_MONOTONIC)
          ending - starting
        end
      end
    end
  end
end
