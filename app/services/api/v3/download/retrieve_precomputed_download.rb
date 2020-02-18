module Api
  module V3
    module Download
      class RetrievePrecomputedDownload
        delegate :filename, to: :@parameters

        # @param parameters [Api::V3::Download::Parameters]
        def initialize(parameters)
          @parameters = parameters
          @format = @parameters.format
          @dirname =
            "#{Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME}/#{@format}"
          @filename = @parameters.filename
          @file_path = "#{@dirname}/#{@filename}"
        end

        def exists?
          @parameters.precompute? && File.exist?(@file_path)
        end

        def call
          return nil unless exists?

          Rails.logger.debug "Retrieving file from #{@file_path}"
          File.read(@file_path)
        end
      end
    end
  end
end
