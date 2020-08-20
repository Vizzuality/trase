class AddSubnationalYearsToContexts < ActiveRecord::Migration[5.2]
  def change
    add_column :contexts, :subnational_years, 'INT[]'
  end
end
