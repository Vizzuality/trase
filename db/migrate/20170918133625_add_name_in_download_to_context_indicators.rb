class AddNameInDownloadToContextIndicators < ActiveRecord::Migration[5.0]
  def change
    add_column :context_indicators, :name_in_download, :text
  end
end
