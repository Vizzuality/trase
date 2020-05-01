module S3
  class ObjectList < BaseService
    # @param options [Hash]
    # @option options [Array<String>] :include prefixes to include
    # @option options [Array<String>] :exclude prefixes to exclude
    def call(options)
      include_prefixes = options&.delete(:include) || []
      exclude_prefixes = options&.delete(:exclude) || []
      objects = @s3.bucket(@bucket_name).objects
      if include_prefixes.any?
        objects = objects.select do |o|
          include_prefixes.include?(o.key.split('/').first)
        end
      end
      if exclude_prefixes.any?
        objects = objects.reject do |o|
          exclude_prefixes.include?(o.key.split('/').first)
        end
      end
      objects.map do |obj|
        {
          name: obj.key,
          key: obj.key.match(/^(\w| )*/).to_s,
          url: obj.presigned_url(:get),
          time: obj.last_modified.strftime('%d-%m-%Y %H:%M:%S')
        }
      end
    end
  end
end
