require "rails_helper"

RSpec.describe Api::V3::DatabaseUpdate, type: :model do
  describe :finished_at do
    context "when started" do
      let(:database_update) {
        FactoryBot.create(
          :api_v3_database_update, status: Api::V3::DatabaseUpdate::STARTED
        )
      }
      it "is nil" do
        expect(database_update.finished_at).to be_nil
      end
    end
    context "when finished" do
      let(:database_update) {
        FactoryBot.create(
          :api_v3_database_update, status: Api::V3::DatabaseUpdate::FINISHED
        )
      }
      it "is present" do
        expect(database_update.finished_at).to eq(database_update.updated_at)
      end
    end
    context "when failed" do
      let(:database_update) {
        FactoryBot.create(
          :api_v3_database_update, status: Api::V3::DatabaseUpdate::FAILED
        )
      }
      it "is present" do
        expect(database_update.finished_at).to eq(database_update.updated_at)
      end
    end
  end

  context "updating stats" do
    let(:database_update) { FactoryBot.create(:api_v3_database_update) }

    describe :update_stats do
      let(:subject) { database_update.update_stats("foo" => "bar") }

      it "does not update status" do
        expect { subject }.not_to(change { database_update.status })
      end
      it "updates stats" do
        expect { subject }.to change {
          database_update.stats
        }.to("foo" => "bar")
      end
      it "bumps timestamp" do
        expect { subject }.to(change { database_update.updated_at })
      end
    end

    describe :finished_with_error do
      let(:subject) {
        database_update.finished_with_error(StandardError.new, "foo" => "bar")
      }

      it "updates status" do
        expect { subject }.to change {
          database_update.status
        }.to(Api::V3::DatabaseUpdate::FAILED)
      end
      it "updates stats" do
        expect { subject }.to change {
          database_update.stats
        }.to("foo" => "bar")
      end
      it "bumps timestamp" do
        expect { subject }.to(change { database_update.updated_at })
      end
    end

    describe :finished_with_success do
      let(:subject) {
        database_update.finished_with_success("foo" => "bar")
      }

      it "updates status" do
        expect { subject }.to change {
          database_update.status
        }.to(Api::V3::DatabaseUpdate::FINISHED)
      end
      it "updates stats" do
        expect { subject }.to change {
          database_update.stats
        }.to("foo" => "bar")
      end
      it "bumps timestamp" do
        expect { subject }.to(change { database_update.updated_at })
      end
    end
  end

  context "stats formatting" do
    let(:stats_hash) {
      {
        "elapsed_seconds" => {"test" => 5.seconds},
        "contexts" => {
          "before" => 0,
          "after" => 1,
          "yellow_tables" => {
            "context_properties" => {
              "before" => 0,
              "after" => 1
            }
          }
        }
      }
    }
    let(:stats_array) {
      [
        "DURATION test: 5 seconds",
        "contexts: BEFORE: 0, AFTER: 1",
        "context_properties: BEFORE: 0, AFTER: 1"
      ]
    }
    # rubocop:disable Naming/HeredocDelimiterNaming
    let(:stats_string) {
      <<~EOS
        DURATION test: 5 seconds
        contexts: BEFORE: 0, AFTER: 1
        context_properties: BEFORE: 0, AFTER: 1
      EOS
    }
    # rubocop:enable Naming/HeredocDelimiterNaming
    let(:database_update) {
      FactoryBot.create(
        :api_v3_database_update,
        status: Api::V3::DatabaseUpdate::FINISHED,
        stats: stats_hash
      )
    }
    describe :stats_to_ary do
      it "returns stats as array" do
        expect(database_update.stats_to_ary).to eq(stats_array)
      end
    end
    describe :stats_to_s do
      it "returns stats as array" do
        expect(database_update.stats_to_s).to eq(stats_string)
      end
    end
  end
end
