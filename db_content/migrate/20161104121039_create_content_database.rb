class CreateSiteDives < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'plpgsql'

    create_table 'ckeditor_assets', force: :cascade do |t|
      t.string 'data_file_name', null: false
      t.string 'data_content_type'
      t.integer 'data_file_size'
      t.string 'data_fingerprint'
      t.integer 'assetable_id'
      t.string 'assetable_type', limit: 30
      t.string 'type', limit: 30
      t.integer 'width'
      t.integer 'height'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.index %w[assetable_type assetable_id], name: 'idx_ckeditor_assetable', using: :btree
      t.index %w[assetable_type type assetable_id], name: 'idx_ckeditor_assetable_type', using: :btree
    end

    create_table 'posts', force: :cascade do |t|
      t.string 'title'
      t.datetime 'date'
      t.string 'image'
      t.string 'post_url'
      t.integer 'state'
      t.text 'description'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.string 'image_file_name'
      t.string 'image_content_type'
      t.integer 'image_file_size'
      t.datetime 'image_updated_at'
      t.boolean 'highlighted', default: false
      t.string 'title_color'
    end

    create_table 'site_dives', force: :cascade do |t|
      t.string 'title'
      t.text 'description'
      t.string 'page_url'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end

    create_table 'users', force: :cascade do |t|
      t.string 'email', default: '', null: false
      t.string 'encrypted_password', default: '', null: false
      t.string 'reset_password_token'
      t.datetime 'reset_password_sent_at'
      t.datetime 'remember_created_at'
      t.integer 'sign_in_count', default: 0, null: false
      t.datetime 'current_sign_in_at'
      t.datetime 'last_sign_in_at'
      t.string 'current_sign_in_ip'
      t.string 'last_sign_in_ip'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.index ['email'], name: 'index_users_on_email', unique: true, using: :btree
      t.index ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true, using: :btree
    end
  end
end
