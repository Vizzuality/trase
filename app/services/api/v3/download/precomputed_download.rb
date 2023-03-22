module Api
  module V3
    module Download
      class PrecomputedDownload
        ROOT_DIRNAME = "public/downloads".freeze

        # @param parameters [Api::V3::Context]
        def initialize(context)
          @download =
            Api::V3::Download::FlowDownload.new(context, pivot: true)
          @dirname = "#{ROOT_DIRNAME}/csv"
          @filename = @download.filename
          @file_path = "#{@dirname}/#{@filename}"
        end

        def call
          ensure_directory_exists

          out = File.new(@file_path, "wb")
          ZipTricks::Streamer.open(out) do |stream|
            Api::V3::Download::StreamContentForCsv.new(@download).call(stream)
          end
          out.close
        end

        class << self
          def clear
            FileUtils.rm_rf(
              Dir.glob("#{Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME}/*"),
              secure: true
            )
            Cache::Cleaner.clear_cache_for_regexp("/api/v3/contexts/.+.csv$")
            Cache::Cleaner.clear_cache_for_regexp("/api/v3/contexts/.+.json$")
          end

          def refresh
            clear_and_refresh_all_contexts do |context|
              Api::V3::Download::PrecomputedDownload.new(context).call
            end
          end

          def refresh_later
            clear_and_refresh_all_contexts do |context|
              PrecomputedDownloadRefreshWorker.perform_async(context.id)
            end
          end

          private

          def clear_and_refresh_all_contexts
            clear
            Api::V3::Context.all.each do |context|
              yield(context)
            end
          end
        end

        private

        def ensure_directory_exists
          return if File.directory?(@dirname)

          FileUtils.mkdir_p(@dirname)
        end
      end
    end
  end
end
