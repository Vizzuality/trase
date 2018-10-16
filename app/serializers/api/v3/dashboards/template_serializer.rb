module Api
  module V3
    module Dashboards
      class TemplateSerializer < ActiveModel::Serializer
        attributes :id, :title, :description

        has_many :sources_mv,
                 serializer: Api::V3::Dashboards::SourceSerializer,
                 key: :sources

        has_many :companies_mv,
                 serializer: Api::V3::Dashboards::CompanySerializer,
                 key: :companies

        has_many :destinations_mv,
                 serializer: Api::V3::Dashboards::DestinationSerializer,
                 key: :destinations

        has_many :commodities,
                 serializer: Api::V3::Dashboards::CommoditySerializer,
                 key: :commodities

        has_many :countries,
                 serializer: Api::V3::Dashboards::CountrySerializer,
                 key: :countries

        attribute :image_url do
          url = object.image.url(:small)
          url = '/content' + url unless Rails.env.development? || Rails.env.test?
          url
        end
      end
    end
  end
end
