module S3
  class Downloader < BaseService
    # @param s3_filename name of S3 object
    # @param local_filename name of local dump file
    def call(s3_filename, local_filename)
      obj = @s3.bucket(@bucket_name).object(s3_filename)
      obj.get(response_target: local_filename)
      obj.metadata
    end
  end
end
