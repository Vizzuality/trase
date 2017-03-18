class EnableTablefuncExtension < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'tablefunc'
  end
end
