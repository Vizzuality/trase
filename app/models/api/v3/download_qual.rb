module Api
  module V3
    class DownloadQual < BaseModel
      belongs_to :download_attribute
      belongs_to :qual
    end
  end
end
