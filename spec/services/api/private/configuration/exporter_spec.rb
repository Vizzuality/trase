require "rails_helper"

RSpec.describe Api::Private::Configuration::Exporter do
  include_context "minimal config for tooltips"

  describe :call do
    let(:event) { FactoryBot.create(:api_private_configuration_export_event) }
    subject { Api::Private::Configuration::Exporter.new(event) }
    it "is successful" do
      subject.call
      event.reload
      expect(event.status).to eq(Api::Private::ConfigurationExportEvent::FINISHED)
    end

    it "exports contexts" do
      subject.call
      event.reload
      expect(event.data["contexts"].size).to eq(1)
    end
  end
end
