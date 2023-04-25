require "rails_helper"

RSpec.describe Api::V3::ManageDownloadAttribute do
  describe :call do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:quant) { FactoryBot.create(:api_v3_quant) }
    let(:subject) {
      Api::V3::ManageDownloadAttribute.new(context, quant)
    }
    context "when download attribute does not exist" do
      it "creates download attribute" do
        expect { subject.call(true, nil) }.to change { context.download_attributes.count }.by(1)
      end
      it "does not create a download attribute" do
        expect { subject.call(false, nil) }.not_to change { context.download_attributes.count }
      end
    end
    context "when download attribute exists" do
      let(:download_attribute) {
        FactoryBot.create(:api_v3_download_attribute, context: context, display_name: "AAA")
      }
      let!(:download_quant){
        FactoryBot.create(
          :api_v3_download_quant,
          download_attribute: download_attribute,
          quant: quant
        )
      }
      it "destroys download attribute" do
        expect { subject.call(false, nil) }.to change { context.download_attributes.count }.by(-1)
      end
      it "renames download attribute" do
        subject.call(true, "BBB")
        expect(download_attribute.reload.display_name).to eq("BBB")
      end
      it "does not create a duplicate" do
        expect { subject.call(true, nil) }.not_to change { context.download_attributes.count }
      end
    end
  end
end
