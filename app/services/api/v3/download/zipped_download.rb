require 'fileutils'
require 'zip'

# @abstract
# Superclass for zipped downloads
module Api
  module V3
    module Download
      class ZippedDownload
        # @param query [Array<Api::V3::Flow>]
        # @param download_name [String]
        def initialize(query, download_name)
          @query = query
          @download_name = download_name
          @temp_dir = "#{Rails.root}/tmp/#{Time.now.strftime('%Y%m%d%H%M%S,%N')}"
        end

        # @return [String] compressed data
        def create
          FileUtils.mkdir_p(@temp_dir)
          create_data_entries
          compressed_stream = compress_data_entries
          compressed_stream.read
        ensure
          FileUtils.rm_rf(@temp_dir)
        end

        private

        def create_data_entries
          readme_entry = {
            path: "#{Rails.root}/public/README.pdf", name: 'README.pdf'
          }
          @data_entries = [readme_entry]
          with_chunked_query do |query, year|
            content = content(query)
            filename = filename(year)
            path = @temp_dir + '/' + filename
            File.open(path, 'w') { |f| f.write content }
            @data_entries << {path: path, name: filename}
          end
        end

        def compress_data_entries
          compressed_stream = Zip::OutputStream.write_buffer do |stream|
            @data_entries.each do |entry|
              stream.put_next_entry(entry[:name])
              stream.write File.read(entry[:path])
            end
          end
          compressed_stream.rewind
          compressed_stream
        end

        # @abstract
        # @param query [ActiveRecord::Relation]
        # @return [String] content
        # @raise [NotImplementedError] when not defined in subclass
        def content(_query)
          raise NotImplementedError
        end

        # @return [String]
        def filename(year)
          "#{@download_name}#{year ? ".#{year}" : nil}.#{format}"
        end

        # @abstract
        # @return [String] format / extension for the file
        # @raise [NotImplementedError] when not defined in subclass
        def format
          raise NotImplementedError
        end

        def with_chunked_query
          if !@query.chunk_by_year?
            yield(@query.all, nil)
          else
            @query.years.each do |year|
              query = @query.by_year(year)
              yield(query, year)
            end
          end
        end
      end
    end
  end
end
