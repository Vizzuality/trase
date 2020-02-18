module ZipHelpers
  def zip_file_entries_filenames(zip_file_path)
    File.open(zip_file_path, 'rb') do |f|
      entries = ZipTricks::FileReader.read_zip_structure(io: f)
      entries.map(&:filename)
    end
  end
end
