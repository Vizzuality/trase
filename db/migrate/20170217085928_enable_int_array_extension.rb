class EnableIntArrayExtension < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'intarray'
  end
end
