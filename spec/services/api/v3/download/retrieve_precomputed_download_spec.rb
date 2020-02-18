require 'rails_helper'

RSpec.describe Api::V3::Download::RetrievePrecomputedDownload do
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
    @params_double = instance_double(Api::V3::Download::Parameters)
    allow(
      Api::V3::Download::Parameters
    ).to receive(:new).and_return(@params_double)
    allow(@params_double).to receive(:filename).and_return('test.zip')
    allow(@params_double).to receive(:precompute?).and_return(true)
    allow(@params_double).to receive(:format).and_return('csv')
  end

  let(:file_path) {
    [
      Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
      'csv',
      'test.zip'
    ].join('/')
  }

  subject {
    Api::V3::Download::RetrievePrecomputedDownload.new(@params_double)
  }

  describe :exists? do
    it "returns false if doesn't exist" do
      FileUtils.rm_rf(file_path)
      expect(subject.exists?).to be(false)
    end

    it 'returns true if exists' do
      FileUtils.touch file_path
      expect(subject.exists?).to be(true)
    end
  end

  describe :call do
    it "returns nil if doesn't exist" do
      FileUtils.rm_rf(file_path)
      expect(subject.call).to be_nil
    end

    it 'returns data if exists' do
      FileUtils.touch file_path
      expect(subject.call).to eq(file_path)
    end
  end
end
