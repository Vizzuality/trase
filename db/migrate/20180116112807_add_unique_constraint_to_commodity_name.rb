class AddUniqueConstraintToCommodityName < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      execute 'ALTER TABLE commodities ADD CONSTRAINT commodities_name_key UNIQUE (name)'
    end
  end

  def down
    with_search_path('revamp') do
      execute 'ALTER TABLE commodities DROP CONSTRAINT commodities_name_key'
    end
  end
end
