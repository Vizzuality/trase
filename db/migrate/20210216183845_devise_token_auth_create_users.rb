class DeviseTokenAuthCreateUsers < ActiveRecord::Migration[5.2]
  def change
    add_column 'content.users', :uid, :text
    add_column 'content.users', :provider, :text
    add_column 'content.users', :tokens, :json
    Content::User.update_all(provider: 'email')
  end
end
