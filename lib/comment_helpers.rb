module CommentHelpers
  def comment_on_table(table, comment)
    ActiveRecord::Base.connection.execute "COMMENT ON TABLE #{table} IS '#{comment}'"
  end

  def comment_on_materialized_view(table, comment)
    ActiveRecord::Base.connection.execute "COMMENT ON MATERIALIZED VIEW #{table} IS '#{comment}'"
  end

  def comment_on_view(table, comment)
    ActiveRecord::Base.connection.execute "COMMENT ON VIEW #{table} IS '#{comment}'"
  end

  def comment_on_column(table, column, comment)
    ActiveRecord::Base.connection.execute "COMMENT ON COLUMN #{table}.#{column} IS '#{comment}'"
  end

  def comment_on_index(index, comment)
    ActiveRecord::Base.connection.execute "COMMENT ON INDEX #{index} IS '#{comment}'"
  end
end
