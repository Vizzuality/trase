require 'rails_helper'

RSpec.describe Api::V3::DownloadController, type: :controller do
  include_context 'api v3 brazil soy flows'
  include_context 'api v3 paraguay context'

  before(:each) do
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    Api::V3::DownloadVersion.current_version_symbol(api_v3_brazil_soy_context) ||
      FactoryBot.create(
        :api_v3_download_version,
        symbol: 'v1.0',
        is_current: true,
        context_id: api_v3_brazil_soy_context.id
      )
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  describe 'GET index' do
    context 'when precomputed' do
      before(:all) {
        FileUtils.mkdir_p 'spec/support/downloads/csv'
        FileUtils.mkdir_p 'spec/support/downloads/json'
      }

      after(:all) {
        FileUtils.rm_rf 'spec/support/downloads'
      }
      before(:each) do
        stub_const(
          'Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME',
          'spec/support/downloads'
        )
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:exists?).and_return(true)
      end
      it 'returns a zipped csv file' do
        @file_name = 'BRAZIL_SOY_v1.0_tc.zip'
        @file_path = [
          Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
          'csv',
          @file_name
        ].join('/')
        FileUtils.touch @file_path
        allow_any_instance_of(
          Api::V3::Download::Parameters
        ).to receive(:filename).and_return(@file_name)
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:call).and_return(@file_path)

        get :index, params: {context_id: api_v3_brazil_soy_context.id}, format: :csv
        expect(assigns(:context)).to eq(api_v3_brazil_soy_context)
        expect(response.content_type).to eq('application/zip')
        expect(
          response.headers['Content-Disposition']
        ).to eq("attachment; filename=\"#{@file_name}\"; filename*=UTF-8''#{@file_name}")
      end
      it 'returns a zipped json file' do
        @file_name = 'BRAZIL_SOY_v1.0_tc.zip'
        @file_path = [
          Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
          'json',
          @file_name
        ].join('/')
        FileUtils.touch @file_path
        allow_any_instance_of(
          Api::V3::Download::Parameters
        ).to receive(:filename).and_return(@file_name)
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:call).and_return(@file_path)

        get :index, params: {context_id: api_v3_brazil_soy_context.id}, format: :json
        expect(assigns(:context)).to eq(api_v3_brazil_soy_context)
        expect(response.content_type).to eq('application/zip')
        expect(
          response.headers['Content-Disposition']
        ).to eq("attachment; filename=\"#{@file_name}\"; filename*=UTF-8''#{@file_name}")
      end
      it 'returns no version on file name if none is available' do
        @file_name = 'PARAGUAY_SOY_tc.zip'
        @file_path = [
          Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
          'csv',
          @file_name
        ].join('/')
        FileUtils.touch @file_path
        allow_any_instance_of(
          Api::V3::Download::Parameters
        ).to receive(:filename).and_return(@file_name)
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:call).and_return(@file_path)

        get :index, params: {context_id: api_v3_paraguay_context.id}, format: :csv
        expect(assigns(:context)).to eq(api_v3_paraguay_context)
        expect(response.content_type).to eq('application/zip')
        expect(
          response.headers['Content-Disposition']
        ).to eq("attachment; filename=\"#{@file_name}\"; filename*=UTF-8''#{@file_name}")
      end
    end

    context 'when generated' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:exists?).and_return(false)
        allow_any_instance_of(
          Api::V3::Download::StreamContentForCsv
        ).to receive(:call)
      end

      it 'returns a zipped csv file' do
        @file_name = 'BRAZIL_SOY_v1.0_tc.zip'
        get :index, params: {context_id: api_v3_brazil_soy_context.id}, format: :csv
        expect(assigns(:context)).to eq(api_v3_brazil_soy_context)
        expect(response.content_type).to eq('application/zip')
        expect(
          response.headers['Content-Disposition']
        ).to eq("attachment; filename=\"#{@file_name}\"")
      end
    end

    context 'when country / commodity params' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::RetrievePrecomputedDownload
        ).to receive(:exists?).and_return(false)
        allow_any_instance_of(
          Api::V3::Download::StreamContentForCsv
        ).to receive(:call)
      end

      it 'returns a zipped csv file' do
        @file_name = 'BRAZIL_SOY_v1.0_tc.zip'
        get :index, params: {
          country_id: api_v3_brazil_soy_context.country_id, commodity_id: api_v3_brazil_soy_context.commodity_id
        }, format: :csv
        expect(assigns(:context)).to eq(api_v3_brazil_soy_context)
        expect(response.content_type).to eq('application/zip')
        expect(
          response.headers['Content-Disposition']
        ).to eq("attachment; filename=\"#{@file_name}\"")
      end
    end
  end
end
