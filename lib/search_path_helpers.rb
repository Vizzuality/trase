module SearchPathHelpers
  def search_path
    ActiveRecord::Base.connection.execute("SHOW search_path")[0]["search_path"]
  end

  def set_search_path(sp)
    ActiveRecord::Base.connection.execute("SET search_path TO #{sp}")
  end

  def with_search_path(sp)
    old_sp = search_path
    set_search_path(sp)
    yield
    set_search_path(old_sp)
  end
end
