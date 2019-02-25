require 'rails_helper'

RSpec.describe Api::V3::Dashboards::ChartDataController, type: :controller do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil municipality quant values'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh
  end

  describe 'GET index' do
    it 'returns values by year for non-temporal attribute with node values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_area.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq(['NOVA UBIRATA'])
    end

    it 'returns values by year for temporal attribute with node values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_land_conflicts.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end

    it 'returns values by year for attribute with flows values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_volume.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end

    it 'returns values for a single company - filtering by exporter node' do
      get :index, params: {
        attribute_id: api_v3_volume.readonly_attribute.id,
        companies_ids: [api_v3_exporter1_node.id].join(',')
      }

      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
      expect(data.map { |e| e['y1']}).to eq([
        flow1_volume.value +
        flow2_volume.value +
        flow3_volume.value +
        flow5_volume.value
      ])
    end

    it 'returns values for multiple companies - filtering by importer and exporter node' do
      get :index, params: {
        attribute_id: api_v3_volume.readonly_attribute.id,
        companies_ids: [api_v3_exporter1_node.id, api_v3_importer1_node.id].join(',')
      }

      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
      expect(data.map { |e| e['y1']}).to eq([
        flow1_volume.value +
        flow2_volume.value +
        flow3_volume.value +
        flow4_volume.value +
        flow5_volume.value
      ])
    end

    it 'returns values for multiple companies - filtering by 2 exporters' do
      get :index, params: {
        attribute_id: api_v3_volume.readonly_attribute.id,
        companies_ids: [
          api_v3_exporter1_node.id,
          api_v3_other_exporter_node.id
        ].join(',')
      }

      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end

    it 'returns values for multiple companies - filtering by 2 importers' do
      get :index, params: {
        attribute_id: api_v3_volume.readonly_attribute.id,
        companies_ids: [
          api_v3_importer1_node.id,
          api_v3_other_importer_node.id
        ].join(',')
      }

      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end

    it 'returns values for multiple matched destinations' do
      get :index, params: {
        attribute_id: api_v3_volume.readonly_attribute.id,
        destinations_ids: [
          api_v3_country_of_destination1_node.id,
          api_v3_other_country_of_destination_node.id
        ].join(',')
      }

      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end
  end
end
