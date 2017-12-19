class AddIsSubNationalFlagToContexts < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      add_column :contexts, :is_subnational, :boolean, null: false, default: false
    end
  end
end
