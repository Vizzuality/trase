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
        if a.key?('id')
          next a['id'] <=> b ['id']
        elsif a.key?('name')
          next a['name'] <=> b['name']
        else
          puts a.inspect
        end
      end
      a <=> b
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
