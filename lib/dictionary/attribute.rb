module Dictionary
  class Attribute
    include Singleton

    def initialize
      @dict = {}
    end

    def reset
      @dict = {}
    end

    def get(key)
      @dict[key] = find_by_name(key) unless @dict.key?(key)
      @dict[key]
    end
  end
end
