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
        compare_hashes(a, b)
      elsif a.is_a?(Array) && b.is_a?(Array)
        compare_arrays(a, b)
      else
        compare_scalars(a, b)
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

  private

  def sorting_key_for_array_of_hashes(a_hash)
    sorting_key = [
      'id', 'name', %w(path quant ind), %w(path quant), %w(node_id attribute_type attribute_id)
    ].find do |key|
      key.is_a?(String) && a_hash.key?(key) ||
        key.is_a?(Array) && (key - a_hash.keys).empty?
    end
    raise 'No sorting key for array: ' + a_hash.inspect unless sorting_key
    sorting_key
  end

  def compare_hashes(a, b)
    sorting_key = sorting_key_for_array_of_hashes(a)
    if sorting_key.is_a?(Array)
      sorting_key.map { |e| a[e] || -1 } <=> sorting_key.map { |e| b[e] || -1 }
    else
      a[sorting_key] <=> b[sorting_key]
    end
  end

  def compare_arrays(a, b)
    if (a - b).empty?
      0
    elsif (a - b).any?
      1
    else
      -1
    end
  end

  def compare_scalars(a, b)
    if a && b
      a <=> b
    else
      a ? -1 : 1
    end
  end
end
