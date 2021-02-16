module Api
  module Private
    class SankeyCardLinkSerializer < ActiveModel::Serializer
      attributes :title, :subtitle, :level1, :level2, :level3, :link, :query_params
      belongs_to :country, serializer: Api::Private::CountryRefSerializer
    end
  end
end
