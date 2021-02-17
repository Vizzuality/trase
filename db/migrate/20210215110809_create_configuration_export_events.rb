class CreateConfigurationExportEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :configuration_export_events do |t|
      t.timestamps
      t.text :status, null: false, default: 'QUEUED'
      t.text :jid
      t.text :started_by
      t.text :error
      t.json :data
    end
  end
end
