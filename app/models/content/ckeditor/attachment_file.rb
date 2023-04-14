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
  module Ckeditor
    class AttachmentFile < Ckeditor::Asset
      has_attached_file :data,
                        url: "/ckeditor_assets/attachments/:id/:filename",
                        path: ":rails_root/public/ckeditor_assets/attachments/:id/:filename"

      validates_attachment_presence :data
      validates_attachment_size :data, less_than: 100.megabytes
      do_not_validate_attachment_file_type :data

      def url_thumb
        @url_thumb ||= Ckeditor::Utils.filethumb(filename)
      end
    end
  end
end
