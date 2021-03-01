module Api
  module Private
    class ProfileSerializer < ActiveModel::Serializer
      attributes  :name,
                  :main_topojson_path,
                  :main_topojson_root,
                  :adm_1_name,
                  :adm_1_topojson_path,
                  :adm_1_topojson_root,
                  :adm_2_name,
                  :adm_2_topojson_path,
                  :adm_2_topojson_root
      has_many :charts, serializer: Api::Private::ChartSerializer
    end
  end
end
