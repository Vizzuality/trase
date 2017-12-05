module Api
  module V3
    module PlaceNode
      class ResultSerializer < ActiveModel::Serializer
        attributes :column_name, :country_name, :country_geo_id, :summary
        attribute :municipality_name, if: :municipality?
        attribute :municipality_geo_id, if: :municipality?
        attribute :logistics_hub_name, if: :logistics_hub?
        attribute :logistics_hub_geo_id, if: :logistics_hub?
        attribute :state_name, if: :state_or_municipality_or_logistics_hub?
        attribute :state_geo_id, if: :state_or_municipality_or_logistics_hub?
        attribute :biome_name, if: :biome_or_municipality_or_logistics_hub?
        attribute :biome_geo_id, if: :biome_or_municipality_or_logistics_hub?
        attribute :area, if: :municipality_or_logistics_hub?
        attribute :soy_production, if: :municipality_or_logistics_hub?
        attribute :soy_area, if: :municipality_or_logistics_hub?
        attribute :soy_farmland, if: :municipality_or_logistics_hub?

        attributes :top_traders, :top_consumers, :indicators,
                   :trajectory_deforestation

        def municipality?
          object.municipality?
        end

        def logistics_hub?
          object.logistics_hub?
        end

        def municipality_or_logistics_hub?
          municipality? || logistics_hub?
        end

        def state_or_municipality_or_logistics_hub?
          object.state? ||
            municipality_or_logistics_hub?
        end

        def biome_or_municipality_or_logistics_hub?
          object.biome? ||
            municipality_or_logistics_hub?
        end
      end
    end
  end
end
