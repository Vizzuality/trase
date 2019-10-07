module Api
  module V3
    module SankeyCardLinks
      class SankeyCardLinkSerializer < ActiveModel::Serializer
        attributes :id,
                   :host,
                   :query_params,
                   :link

        belongs_to :country_id
        belongs_to :commodity_id
      end
    end
  end
end
