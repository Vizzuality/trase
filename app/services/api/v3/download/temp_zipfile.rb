module Api
  module V3
    module Download
      class TempZipfile
        def initialize(zipfilename)
          @zipfile = Tempfile.new("#{zipfilename}.zip")
        end

        def add(content, filename)
          tempfile = Tempfile.new(filename)
          tempfile << content
          tempfile.close

          Zip::OutputStream.open(@zipfile) { |zos| }
          Zip::File.open(@zipfile.path, Zip::File::CREATE) do |zipfile|
            zipfile.add(filename, tempfile.path)
            zipfile.add('README.pdf', "#{Rails.root}/public/README.pdf")
          end
          @zipfile
        end
      end
    end
  end
end
