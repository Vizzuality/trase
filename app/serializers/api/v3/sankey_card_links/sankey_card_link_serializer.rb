module Api
  module V3
    module SankeyCardLinks
      class SankeyCardLinkSerializer < ActiveModel::Serializer
        attributes :id,
                   :query_params,
                   :title,
                   :subtitle

        belongs_to :country_id
        belongs_to :commodity_id
      end
    end
  end
end
