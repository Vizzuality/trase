require 'rails_helper'

RSpec.describe Api::V3::DatabaseChecks::HasOneAssociationPresent do
  context 'when checking contexts' do
    let(:context) {
      FactoryBot.create(:api_v3_context)
    }
    let(:check) {
      Api::V3::DatabaseChecks::HasOneAssociationPresent.new(
        context,
        association: :context_property
      )
    }
    let(:report_status) {
      Api::V3::DatabaseChecks::ReportStatus.new
    }
    context 'when context property missing' do
      describe :passing? do
        it "doesn't pass" do
          expect(check).not_to be_passing
        end
      end
      describe :call do
        it 'adds an error' do
          expect {
            check.call(report_status)
          }.to change(report_status, :error_count).by(1)
        end
      end
    end

    context 'when context property present' do
      let!(:context_property) {
        FactoryBot.create(:api_v3_context_property, context: context)
      }
      describe :passing? do
        it 'passes' do
          expect(check).to be_passing
        end
      end
      describe :call do
        it "doesn't add an error" do
          expect {
            check.call(report_status)
          }.not_to change(report_status, :error_count)
        end
      end
    end
  end
end