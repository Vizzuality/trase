module Api
  module V3
    class DownloadQuant < BaseModel
      belongs_to :download_attribute
      belongs_to :quant
    end
  end
end
