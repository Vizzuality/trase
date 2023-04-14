require "rails_helper"

RSpec.describe Api::V3::Import::Stats do
  let(:blue_table_class) { Api::V3::Context }
  let(:yellow_table_class) { Api::V3::ContextProperty }

  context "when starting with empty stats" do
    let(:subject) { Api::V3::Import::Stats.new({}) }

    describe :update_blue_table_before do
      it "updates the correct key" do
        subject.update_blue_table_before(blue_table_class, 0)
        expect(subject.to_h).to eq("contexts" => {"before" => 0})
      end
    end

    describe :update_yellow_table_before do
      it "updates the correct key" do
        subject.update_yellow_table_before(yellow_table_class, 0)
        expect(subject.to_h).to eq(
          "contexts" => {
            "yellow_tables" => {"context_properties" => {"before" => 0}}
          }
        )
      end
    end
  end

  context "when appending to existing stats" do
    let(:subject) {
      Api::V3::Import::Stats.new(
        "contexts" => {
          "before" => 0,
          "yellow_tables" => {"context_properties" => {"before" => 0}}
        }
      )
    }

    describe :update_blue_table_after do
      it "updates the correct key" do
        subject.update_blue_table_after(blue_table_class, 1)
        expect(subject.to_h).to eq(
          "contexts" => {
            "before" => 0,
            "after" => 1,
            "yellow_tables" => {"context_properties" => {"before" => 0}}
          }
        )
      end
    end

    describe :update_yellow_table_after do
      it "updates the correct key" do
        subject.update_yellow_table_after(yellow_table_class, 1)
        expect(subject.to_h).to eq(
          "contexts" => {
            "before" => 0,
            "yellow_tables" => {
              "context_properties" => {"before" => 0, "after" => 1}
            }
          }
        )
      end
    end
  end
end
