# == Schema Information
#
# Table name: ckeditor_assets
#
#  id                :integer          not null, primary key
#  data_file_name    :string           not null
#  data_content_type :string
#  data_file_size    :integer
#  data_fingerprint  :string
#  assetable_id      :integer
#  assetable_type    :string(30)
#  type              :string(30)
#  width             :integer
#  height            :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
module Content
  class Ckeditor::Asset < Content::Base
    include Ckeditor::Orm::ActiveRecord::AssetBase
    include Ckeditor::Backend::Paperclip
  end
end
