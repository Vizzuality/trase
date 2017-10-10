class AddDataDownloadVersionPerContext < ActiveRecord::Migration[5.0]
  def change
    add_column :download_versions, :context_id, :integer
  end
end
