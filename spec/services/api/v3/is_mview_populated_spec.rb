require "rails_helper"

RSpec.describe Api::V3::IsMviewPopulated do
  describe :call do
    let(:subject) { Api::V3::IsMviewPopulated.new(:flow_quant_totals_mv) }

    it "should return false when not populated" do
      Api::V3::Readonly::FlowQuantTotal.connection.execute("REFRESH MATERIALIZED VIEW flow_quant_totals_mv WITH NO DATA")
      expect(subject.call).to be false
    end

    it "should return true when populated" do
      Api::V3::Readonly::FlowQuantTotal.refresh(sync: true)
      expect(subject.call).to be true
    end
  end
end
