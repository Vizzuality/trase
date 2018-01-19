module Api
  module V3
    class DownloadQual < BaseModel
      include Api::V3::Import::YellowTableHelpers

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
