module Api
  module V3
    class DownloadAttribute < BaseModel
      belongs_to :context
    end
  end
end
