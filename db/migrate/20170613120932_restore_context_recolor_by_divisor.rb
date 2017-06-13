class RestoreContextRecolorByDivisor < ActiveRecord::Migration[5.0]
  def change
    add_column :context_recolor_by, :divisor, :float
  end
end
