shared_context "api v3 indonesia context node types" do
  include_context "api v3 indonesia context"
  include_context "api v3 indonesia node types"

  let!(:api_v3_indonesia_country_of_production_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_country_of_production_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        role: "source",
        is_geo_column: true
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_kabupaten_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_kabupaten_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_kabupaten_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        role: "source",
        is_geo_column: true,
        is_default: true
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_mill_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_mill_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_mill_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        role: "source",
        is_geo_column: true
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_port_of_export_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_port_of_export_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_port_of_export_node_type,
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        role: "exporter"
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_exporter_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_exporter_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_exporter_node_type,
        column_position: 4
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        role: "exporter",
        is_default: true
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_importer_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_importer_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_importer_node_type,
        column_position: 5
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2,
        role: "importer",
        is_default: true
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_economic_bloc_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_country_node_type,
        column_position: 6
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3,
        role: "destination"
      )
    end
    cnt
  end

  let!(:api_v3_indonesia_country_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_indonesia_context.id,
      node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_indonesia_context,
        node_type: api_v3_country_node_type,
        column_position: 7
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3,
        role: "destination",
        is_default: true
      )
    end
    cnt
  end
end
