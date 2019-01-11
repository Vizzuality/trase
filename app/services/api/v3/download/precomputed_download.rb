module Api
  module V3
    module Download
      class PrecomputedDownload
        ROOT_DIRNAME = 'public/downloads'.freeze

        # @param parameters [Api::V3::Download::Parameters]
        def initialize(parameters)
          @parameters = parameters
          @format = @parameters.format
          @dirname = "#{ROOT_DIRNAME}/#{@format}"
          @filename = @parameters.filename
          @file_path = "#{@dirname}/#{@filename}"
        end

        def retrieve
          return nil unless File.exist?(@file_path)

          Rails.logger.debug "Retrieving file from #{@file_path}"
          File.read(@file_path)
        end

        def store(data)
          ensure_directory_exists
          Rails.logger.debug "Storing file at #{@file_path}"
          File.open(@file_path, 'w') { |f| f.write data }
        end

        class << self
          def clear
            FileUtils.rm_rf(
              Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
              secure: true
            )
            Cache::Cleaner.clear_cache_for_regexp('/api/v3/contexts/.+.csv$')
            Cache::Cleaner.clear_cache_for_regexp('/api/v3/contexts/.+.json$')
          end

          def refresh
            clear_and_refresh_all_contexts do |context|
              Api::V3::Download::FlowDownload.new(context, pivot: true).
                zipped_csv
            end
          end

          def refresh_later
            clear_and_refresh_all_contexts do |context|
              PrecomputedDownloadRefreshWorker.perform_async(
                context.id, pivot: true
              )
            end
          end
        end

        private

        def ensure_directory_exists
          return if File.directory?(@dirname)

          FileUtils.mkdir_p(@dirname)
        end

        private_class_method def self.clear_and_refresh_all_contexts
          clear
          Api::V3::Context.all.each do |context|
            yield(context)
          end
        end
      end
    end
  end
end
