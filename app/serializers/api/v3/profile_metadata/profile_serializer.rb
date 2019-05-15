module Api
  module V3
    module ProfileMetadata
      class ProfileSerializer < ActiveModel::Serializer
        attributes :id, :context_node_type_id, :name,
                   :main_topojson_path, :main_topojson_root,
                   :adm_1_name, :adm_1_topojson_path, :adm_1_topojson_root,
                   :adm_2_name, :adm_2_topojson_path, :adm_2_topojson_root

        has_many :charts, serializer: Api::V3::ProfileMetadata::ChartSerializer
      end
    end
  end
end
