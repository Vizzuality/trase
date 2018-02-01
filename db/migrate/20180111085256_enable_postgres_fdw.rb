class EnablePostgresFdw < ActiveRecord::Migration[5.1]
  def change
    enable_extension 'postgres_fdw'
  end
end
