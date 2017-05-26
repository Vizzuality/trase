class RemoveContextRecolorByDivisor < ActiveRecord::Migration[5.0]
  def change
    remove_column :context_recolor_by, :divisor
  end
end
