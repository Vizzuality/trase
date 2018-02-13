class CreateContentTables < ActiveRecord::Migration[5.1]
  def change
    with_search_path('content') do
      # These are extensions that must be enabled in order to support this database
      enable_extension "plpgsql"

      create_table "ckeditor_assets", id: :serial, force: :cascade do |t|
        t.string "data_file_name", null: false
        t.string "data_content_type"
        t.integer "data_file_size"
        t.string "data_fingerprint"
        t.integer "assetable_id"
        t.string "assetable_type", limit: 30
        t.string "type", limit: 30
        t.integer "width"
        t.integer "height"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
        t.index ["assetable_type", "assetable_id"], name: "idx_ckeditor_assetable"
        t.index ["assetable_type", "type", "assetable_id"], name: "idx_ckeditor_assetable_type"
      end

      create_table "posts", id: :serial, force: :cascade do |t|
        t.text "title", null: false
        t.datetime "date", null: false
        t.text "post_url", null: false
        t.integer "state", null: false, default: 0
        t.boolean "highlighted", null: false, default: false
        t.text "category", null: false
        t.text "image_file_name"
        t.text "image_content_type"
        t.integer "image_file_size"
        t.datetime "image_updated_at"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end

      create_table "site_dives", id: :serial, force: :cascade do |t|
        t.text "title", null: false
        t.text "page_url", null: false
        t.text "description", null: false
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end

      create_table "staff_groups", force: :cascade do |t|
        t.text "name", null: false
        t.integer "position", null: false
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end

      create_table "staff_members", force: :cascade do |t|
        t.references :staff_group, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}, index: true
        t.text "name", null: false
        t.integer "position", null: false
        t.text "bio", null: false
        t.text "image_file_name"
        t.text "image_content_type"
        t.integer "image_file_size"
        t.datetime "image_updated_at"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end

      create_table "testimonials", force: :cascade do |t|
        t.text "quote", null: false
        t.text "author_name", null: false
        t.text "author_title", null: false
        t.string "image_file_name"
        t.string "image_content_type"
        t.integer "image_file_size"
        t.datetime "image_updated_at"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end

      create_table "users", id: :serial, force: :cascade do |t|
        t.string "email", default: "", null: false
        t.string "encrypted_password", default: "", null: false
        t.string "reset_password_token"
        t.datetime "reset_password_sent_at"
        t.datetime "remember_created_at"
        t.integer "sign_in_count", default: 0, null: false
        t.datetime "current_sign_in_at"
        t.datetime "last_sign_in_at"
        t.string "current_sign_in_ip"
        t.string "last_sign_in_ip"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
        t.index ["email"], name: "index_users_on_email", unique: true
        t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
      end
    end
  end
end
