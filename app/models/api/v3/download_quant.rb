# == Schema Information
#
# Table name: download_quants
#
#  id                                                                              :integer          not null, primary key
#  download_attribute_id                                                           :integer          not null
#  quant_id                                                                        :integer          not null
#  is_filter_enabled(When set, enable selection of value ranges (advanced filter)) :boolean          default(FALSE), not null
#  filter_bands(Array of value ranges to allow filtering by)                       :float            is an Array
#
# Indexes
#
#  download_quants_download_attribute_id_idx           (download_attribute_id)
#  download_quants_download_attribute_id_quant_id_key  (download_attribute_id,quant_id) UNIQUE
#  download_quants_quant_id_idx                        (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (download_attribute_id => download_attributes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#
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
