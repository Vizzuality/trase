require "aws-sdk-s3"

module S3
  class BaseService
    include Singleton

    def initialize
      @bucket_name = ENV["S3_BUCKET_NAME"]
      @client = Aws::S3::Client.new(region: ENV["AWS_REGION"])
      @s3 = Aws::S3::Resource.new(client: @client)
    end
  end
end
