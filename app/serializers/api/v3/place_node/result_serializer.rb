module Api
  module V3
    module PlaceNode
      class ResultSerializer < ActiveModel::Serializer
        # "column_name":"MUNICIPALITY",
        # "country_name":"BRAZIL",
        # "country_geo_id":"BR",
        # "municipality_name":"SORRISO",
        # "municipality_geo_id":"BR5107925",
        # "biome_name":"CERRADO",
        # "biome_geo_id":"BR2",
        # "state_name":"MATO GROSSO",
        # "state_geo_id":"BR51",
        # "area":9329.6,
        # "soy_production":1951710.0,
        # "soy_area":"619,984",
        # "soy_farmland":57.73,
        # "top_traders":{  },
        # "top_consumers":{  },
        # "indicators":[  ],
        # "trajectory_deforestation":{  },
        # "summary":"In"
        attributes :column_name, :country_name, :country_geo_id, :summary
        # object.basic_attributes.dynamic_attributes.each do |name, value|
        #   attribute name { value }
        # end
      end
    end
  end
end
