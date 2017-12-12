class HashSorter
  def initialize(hash)
    @hash = hash
  end

  def sort
    sort_hash(@hash)
  end

  def sort_hash(hash)
    hash.keys.sort.each_with_object({}) do |key, seed|
      seed[key] = hash[key]
      if seed[key].is_a?(Hash)
        seed[key] = sort_hash(seed[key])
      elsif seed[key].is_a?(Array)
        seed[key] = sort_array(seed[key])
      end
    end
  end

  def sort_array(array)
    tmp = array.sort do |a, b|
      if a.is_a?(Hash) && b.is_a?(Hash)
        sorting_key = ['id', 'name', %w(path quant ind), %w(path quant)].find do |key|
          key.is_a?(String) && a.key?(key) ||
            key.is_a?(Array) && (key - a.keys).empty?
        end
        raise 'No sorting key for array: ' + a.inspect unless sorting_key

        if sorting_key.is_a?(Array)
          sorting_key.map { |e| a[e] || -1 } <=> sorting_key.map { |e| b[e] || -1 }
        else
          a[sorting_key] <=> b[sorting_key]
        end
      else
        a <=> b
      end
    end
    tmp.each_with_index do |elem, idx|
      if elem.is_a?(Hash)
        tmp[idx] = sort_hash(elem)
      elsif elem.is_a?(Array)
        tmp[idx] = sort_array(elem)
      end
    end
    tmp
  end
end
