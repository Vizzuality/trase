# == Schema Information
#
# Table name: download_quals
#
#  id                                                                                 :integer          not null, primary key
#  download_attribute_id                                                              :integer          not null
#  qual_id                                                                            :integer          not null
#  is_filter_enabled(When set, enable selection of discreet values (advanced filter)) :boolean          default(FALSE), not null
#
# Indexes
#
#  download_quals_download_attribute_id_qual_id_key  (download_attribute_id,qual_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (download_attribute_id => download_attributes.id) ON DELETE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class DownloadQual < YellowTable
      belongs_to :download_attribute
      belongs_to :qual

      def self.yellow_foreign_keys
        [
          {name: :download_attribute_id, table_class: Api::V3::DownloadAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
