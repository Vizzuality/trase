class AddSummaryProfileTypeAndYearToTopProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :top_profiles, :summary, :text
    add_column :top_profiles, :year, :integer
    add_column :top_profiles, :profile_type, :string
  end
end
