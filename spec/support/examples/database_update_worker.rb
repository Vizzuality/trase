shared_examples 'a database update worker' do
  let(:database_update) {
    FactoryBot.create(:api_v3_database_update)
  }

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
    allow_any_instance_of(
      Api::V3::SankeyCardLinks::RefreshQueryParams
    ).to receive(:call)
  end

  context 'When processing a successful database import' do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:backup).and_return(nil)
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:import).and_return({})
    end

    it 'updates database_updates status to FINISHED' do
      subject
      expect(database_update.reload.status).to eq(
        Api::V3::DatabaseUpdate::FINISHED
      )
    end
  end

  context 'When processing a failed database import' do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:backup).and_return(nil)
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:import).and_raise(PG::Error)
    end

    it 'raises exception' do
      expect { subject }.to raise_exception(PG::Error)
    end

    it 'updates database_updates status to FAILED' do
      begin
        subject
      rescue
        expect(database_update.reload.status).to eq(
          Api::V3::DatabaseUpdate::FAILED
        )
      end
    end
  end
end
