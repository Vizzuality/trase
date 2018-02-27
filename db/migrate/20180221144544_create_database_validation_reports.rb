class CreateDatabaseValidationReports < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      create_table :database_validation_reports do |t|
        t.json :report, null: false
        t.integer :error_count, null: false
        t.integer :warning_count, null: false

        t.timestamps
      end
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :database_validation_reports
    end
  end
end
