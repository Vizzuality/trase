class CreateUniqueConstraintOnChartsIdentifier < ActiveRecord::Migration[5.1]
  def up
    execute 'ALTER TABLE charts ADD CONSTRAINT charts_profile_id_parent_id_identifier_key UNIQUE (profile_id, parent_id, identifier)'
  end

  def down
    execute 'ALTER TABLE DROP CONSTRAINT charts_profile_id_parent_id_identifier_key'
  end
end
