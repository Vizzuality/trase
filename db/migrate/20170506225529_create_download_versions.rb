class CreateDownloadVersions < ActiveRecord::Migration[5.0]
  def change
    create_table :download_versions do |t|
      t.string :symbol, null: false
      t.boolean :current, default: false
      t.timestamps
    end
    add_index :download_versions, :symbol, unique: true
    DownloadVersion.create(symbol: '1.0', current: true)
  end
end
