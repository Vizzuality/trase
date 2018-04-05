require 'fileutils'
require 'zip'

# @abstract
# Superclass for zipped downloads
module Api
  module V3
    module Download
      class ZippedDownload
        # @param query [Array<Api::V3::Readonly::DownloadFlow>]
        # @param download_name [String]
        def initialize(query, download_name)
          @query = query
          @download_name = download_name
        end

        # @abstract
        # @return [String] content
        # @raise [NotImplementedError] when not defined in subclass
        def content
          raise NotImplementedError
        end

        def content_tempfile(content)
          tempfile = Tempfile.new(filename)
          tempfile << content
          tempfile.close
          tempfile
        end

        # @abstract
        # @return [String] name of file as included in zip archive
        # @raise [NotImplementedError] when not defined in subclass
        def filename
          raise NotImplementedError
        end

        def create
          @zipfile = Tempfile.new("#{@download_name}.zip")
          Zip::OutputStream.open(@zipfile) { |zos| }
          Zip::File.open(@zipfile.path, Zip::File::CREATE) do |zipfile|
            zipfile.add(filename, content_tempfile(content).path)
            zipfile.add('README.pdf', "#{Rails.root}/public/README.pdf")
          end
          @zipfile
        end
      end
    end
  end
end
