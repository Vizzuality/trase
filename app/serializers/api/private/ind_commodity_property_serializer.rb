module Api
  module Private
    class IndCommodityPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :tooltip_text
      belongs_to :commodity, serializer: Api::Private::CommodityRefSerializer
    end
  end
end
