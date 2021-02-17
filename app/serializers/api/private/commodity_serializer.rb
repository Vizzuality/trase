module Api
  module Private
    class CommoditySerializer < ActiveModel::Serializer
      attributes :name
      has_many :sankey_card_links, serializer: Api::Private::SankeyCardLinkSerializer
    end
  end
end
