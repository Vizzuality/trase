module Zipfile
  def self.extract_data_file_to_path(zipfile_path, file_path, format)
    File.open(zipfile_path, "rb") do |f|
      entries = ZipTricks::FileReader.read_zip_structure(io: f)
      entries.each do |entry|
        if entry.filename =~ /.+\.#{format}$/
          File.open(file_path, "wb") do |extracted_file|
            ex = entry.extractor_from(f)
            extracted_file << ex.extract(1024 * 1024) until ex.eof?
          end
          break
        end
      end
    end
  end

  def self.zip_dir(src_dir, zipfile_path)
    out = File.new(zipfile_path, "wb")
    ZipTricks::Streamer.open(out) do |stream|
      Dir["#{src_dir}/**/**"].reject { |f| File.directory?(f) }.each do |file|
        filename = file.sub(src_dir + "/", "")
        stream.write_deflated_file(filename) do |writer|
          File.open(file, "rb"){ |source| IO.copy_stream(source, writer) }
        end
      end
    end
    out.close
  end

  def self.unzip_archive(zipfile_path, dest_dir)
    File.open(zipfile_path, "rb") do |f|
      entries = ZipTricks::FileReader.read_zip_structure(io: f)
      entries.each do |entry|
        file_path = File.join(dest_dir, entry.filename)
        FileUtils.mkdir_p(File.dirname(file_path))
        File.open(file_path, "wb") do |extracted_file|
          ex = entry.extractor_from(f)
          extracted_file << ex.extract(1024 * 1024) until ex.eof?
        end
      end
    end
  end
end
