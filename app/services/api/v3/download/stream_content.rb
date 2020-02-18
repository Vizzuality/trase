module Api
  module V3
    module Download
      class StreamContent
        # @param download [Api::V3::Download::FlowDownload]
        def initialize(download)
          @download = download
          @download_name = @download.download_name
          @query = download.query
        end

        def call(stream)
          write_readme(stream)
          write_data_entries(stream)
        end

        private

        def write_readme(stream)
          stream.write_deflated_file('README.pdf') do |writer|
            IO.copy_stream(
              File.open("#{Rails.root}/public/README.pdf", 'rb'), writer
            )
          end
        end

        def write_data_entries(stream)
          with_chunked_query do |query, year|
            filename = filename(year)
            stream.write_deflated_file(filename) do |writer|
              write_data_entry(query, writer)
            end
          end
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

        # @return [String]
        def filename(year)
          "#{@download_name}#{year ? ".#{year}" : nil}.#{format}"
        end

        # @abstract
        # @param writer [ZipTricks::Streamer::Writable]
        # @raise [NotImplementedError] when not defined in subclass
        def write_data_entry(_writer)
          raise NotImplementedError
        end

        # @abstract
        # @return [String] format / extension for the file
        # @raise [NotImplementedError] when not defined in subclass
        def format
          raise NotImplementedError
        end
      end
    end
  end
end
