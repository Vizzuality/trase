class AddCountryToProfileNameCheck < ActiveRecord::Migration[5.2]
  def up
    execute 'ALTER TABLE profiles DROP CONSTRAINT profiles_name_check'
    execute "ALTER TABLE profiles ADD CONSTRAINT profiles_name_check CHECK (name IN ('actor', 'place', 'country'))"
  end

  def down
    execute 'ALTER TABLE profiles DROP CONSTRAINT profiles_name_check'
    execute "ALTER TABLE profiles ADD CONSTRAINT profiles_name_check CHECK (name IN ('actor', 'place'))"
  end
end
