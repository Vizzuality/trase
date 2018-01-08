class HashSorter
  def initialize(hash)
    @hash = hash
  end

  def sort
    sort_hash(@hash)
  end

  def sort_hash(hash)
    hash.keys.sort.each_with_object({}) do |key, seed|
      seed[key] = sort_value(hash[key])
    end
  end

  def sort_array(array)
    tmp = array.map do |element|
      sort_value(element)
    end
    tmp.sort do |a, b|
      compare_value(a, b)
    end
  end

  private

  def compare_value(a, b)
    if a.is_a?(Hash) && b.is_a?(Hash)
      compare_hashes(a, b)
    elsif a.is_a?(Array) && b.is_a?(Array)
      compare_arrays(a, b)
    else
      compare_scalars(a, b)
    end
  end

  def sort_value(value)
    if value.is_a?(Hash)
      sort_hash(value)
    elsif value.is_a?(Array)
      sort_array(value)
    else
      value
    end
  end

  def compare_hashes(a, b)
    sorting_key = a.keys
    result = -1
    sorting_key.each do |key|
      result = nil_aware_compare_hashes(a, b, key)
      break result unless result.zero?
    end
    result
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

  def nil_aware_compare_hashes(a, b, sorting_key)
    if a[sorting_key] && b[sorting_key]
      compare_value(a[sorting_key], b[sorting_key])
    elsif a[sorting_key]
      1
    elsif b[sorting_key]
      -1
    else
      0
    end
  end
end
