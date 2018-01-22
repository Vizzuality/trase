module Api
  module V3
    class DownloadQuant < YellowTable
      belongs_to :download_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :download_attribute_id, table_class: Api::V3::DownloadAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
