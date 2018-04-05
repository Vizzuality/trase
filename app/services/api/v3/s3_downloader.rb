module Api
  module V3
    class S3Downloader
      include Singleton
      def initialize
        @bucket_name = ENV['S3_BUCKET_NAME']
        @s3 = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
      end

      # @param s3_filename name of S3 object
      # @param local_filename name of local dump file
      def call(s3_filename, local_filename)
        obj = @s3.bucket(@bucket_name).object(s3_filename)
        obj.get(response_target: local_filename)
        obj.metadata
      end
    end
  end
end
