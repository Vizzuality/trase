require 'zip'

module Zipfile
  def self.extract_data_file(zipfile_content, format)
    Zip::File.open_buffer(zipfile_content) do |zipfile|
      entry = zipfile.glob("*.#{format}").first
      break nil unless entry
      break entry.get_input_stream.read
    end
  end

  def self.extract_data_file_to_path(zipfile_path, file_path, format)
    Zip::File.open(zipfile_path) do |zipfile|
      entry = zipfile.glob("*.#{format}").first
      break entry&.extract(file_path)
    end
  end

  def self.zip_dir(src_dir, archive)
    FileUtils.rm archive, force: true

    Zip::File.open(archive, 'w') do |zipfile|
      Dir["#{src_dir}/**/**"].reject { |f| f == archive }.each do |file|
        zipfile.add(file.sub(src_dir + '/', ''), file)
      end
    end
  end

  def self.unzip_archive(archive, dest_dir)
    Zip::File.open(archive) do |zip_file|
      zip_file.each do |f|
        f_path = File.join(dest_dir, f.name)
        FileUtils.mkdir_p(File.dirname(f_path))
        zip_file.extract(f, f_path) unless File.exist?(f_path)
      end
    end
  end
end
