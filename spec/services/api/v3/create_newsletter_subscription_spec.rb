require "rails_helper"

RSpec.describe Api::V3::CreateNewsletterSubscription, :service do
  describe "#call" do
    let(:service) { Api::V3::CreateNewsletterSubscription.new }
    it "raises error when email not given" do
      expect {
        service.call({email: ""}, nil)
      }.to raise_error(ArgumentError)
    end

    it "raises error when source invalid" do
      expect {
        service.call({email: "xxx@example.com", source: "foobar"}, nil)
      }.to raise_error(ArgumentError)
    end

    let(:audience_id) { " " }
    let(:email) { "xxx@example.com" }
    let(:common_merge_fields) {
      ["FNAME", "LNAME", "MMERGE3", "SIGNUPLOC"]
    }
    let(:extra_merge_fields) {
      ["COUNTRY", "TRASETYPE", "TRASEUSE", "TRASEWORK", "TRASEMAIL"]
    }

    before(:each) do
      @lists_api = instance_double(MailchimpMarketing::ListsApi)
      allow_any_instance_of(MailchimpMarketing::Client).to receive(:lists).and_return(@lists_api)
      allow(service).to receive(:audience_id).and_return(audience_id)
    end

    context "when source is footer form" do
      let(:source) { "footer" }
      let(:referrer) { nil }

      it "sets status to subscribed when subscribe set" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(body[:status]).to eq(:subscribed)
        end
        service.call({email: email, source: source, subscribe: "true"}, referrer)
      end

      it "sets status to unsubscribed when subscribe not set" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(body[:status]).to eq(:unsubscribed)
        end
        service.call({email: email, source: source, subscribe: "false"}, referrer)
      end

      it "includes common merge fields" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(common_merge_fields - body[:merge_fields].keys).to be_empty
        end
        service.call({email: email, source: source}, referrer)
      end

      it "excludes extra merge fields" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(extra_merge_fields - body[:merge_fields].keys).to eq(extra_merge_fields)
        end
        service.call({email: email, source: source}, referrer)
      end
    end

    context "when source is download form" do
      let(:source) { "download" }
      let(:referrer) { nil }

      it "sets status to subscribed when subscribe set" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(body[:status]).to eq(:subscribed)
        end
        service.call({email: email, source: source, subscribe: "true"}, referrer)
      end

      it "sets status to unsubscribed when subscribe not set" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(body[:status]).to eq(:unsubscribed)
        end
        service.call({email: email, source: source, subscribe: "false"}, referrer)
      end

      it "includes common merge fields" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(common_merge_fields - body[:merge_fields].keys).to be_empty
        end
        service.call({email: email, source: source}, referrer)
      end

      it "includes extra merge fields" do
        expect(@lists_api).to receive(:add_list_member) do |audience_id, body|
          expect(extra_merge_fields - body[:merge_fields].keys).to be_empty
        end
        service.call({email: email, source: source}, referrer)
      end
    end
  end
end
