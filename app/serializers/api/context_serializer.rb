module Api
  module V3
    class ContextSerializer < ActiveModel::Serializer
      attributes :id,
                 :is_default,
                 :is_disabled,
                 :years,
                 :subnational_years,
                 :default_year,
                 :country_id,
                 :country_name,
                 :commodity_id,
                 :commodity_name,
                 :default_basemap,
                 :is_subnational,
                 :is_highlighted
    end
  end
end
