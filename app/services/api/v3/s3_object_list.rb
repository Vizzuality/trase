module Api
  module V3
    class S3ObjectList
      include Singleton
      def initialize
        @bucket_name = ENV['S3_BUCKET_NAME']
        @s3 = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
      end

      def call
        @s3.bucket(@bucket_name).objects.map do |obj|
          {
            name: obj.key,
            url: obj.presigned_url(:get),
            time: obj.last_modified.strftime('%d-%m-%Y %H:%M:%S')
          }
        end
      end
    end
  end
end
