module S3
  class Uploader < BaseService
    # @param s3_filename name of S3 object
    # @param local_filename name of local dump file
    def call(s3_filename, local_filename, metadata = {})
      obj = @s3.bucket(@bucket_name).object(s3_filename)
      obj.upload_file(local_filename, metadata: metadata)
    end
  end
end
