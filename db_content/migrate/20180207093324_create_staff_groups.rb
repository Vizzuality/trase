class CreateStaffGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :staff_groups do |t|
      t.text :name, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_reference :staff_members, :staff_group, null: false
  end
end
