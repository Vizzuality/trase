# Prepares checks to be run on download_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   check for widows (download_attributes without download_qual or download_quant)
module Api
  module V3
    module DatabaseChecks
      class DownloadAttributeCheckChain < CheckChain
        validates :declared_years_match_data,
                  association: :download_quant,
                  link: {
                    method: :admin_download_attribute_path,
                    params: [:download_attribute]
                  }
        validates :declared_years_match_data,
                  association: :download_qual,
                  link: {
                    method: :admin_download_attribute_path,
                    params: [:download_attribute]
                  }
      end
    end
  end
end
