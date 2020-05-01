module S3
  class CannedAcl < BaseService
    # @param s3_filename name of S3 object
    def call(s3_filename, acl = 'public-read')
      @client.put_object_acl(
        acl: acl,
        bucket: @bucket_name,
        key: s3_filename
      )
    end
  end
end
