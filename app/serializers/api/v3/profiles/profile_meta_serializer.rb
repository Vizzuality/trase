module Api
  module V3
    module Profiles
      class ProfileMetaSerializer < ActiveModel::Serializer
        attributes :id,
                   :name,
                   :context_id,
                   :commodity_id,
                   :country_id,
                   :activity,
                   :commodities,
                   :activities,
                   :years,
                   :profile_type,
                   :main_topojson_path,
                   :main_topojson_root,
                   :adm_1_name,
                   :adm_1_topojson_path,
                   :adm_1_topojson_root,
                   :adm_2_name,
                   :adm_2_topojson_path,
                   :adm_2_topojson_root

        has_many :charts, serializer: Api::V3::Profiles::ChartSerializer
      end
    end
  end
end
