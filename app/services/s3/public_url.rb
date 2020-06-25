module S3
  class PublicUrl < BaseService
    # @param s3_filename name of S3 object
    def call(s3_filename)
      obj = @s3.bucket(@bucket_name).object(s3_filename)
      obj.public_url
    end
  end
end
