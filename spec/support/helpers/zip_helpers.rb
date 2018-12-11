module ZipHelpers
  def unzip(data)
    fin = StringIO.new(data)

    entries = {}

    ::Zip::InputStream.open(fin) do |fzip|
      while entry = fzip.get_next_entry
        entries[entry.name] = fzip.read
      end
    end

    entries
  end
end
