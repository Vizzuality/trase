RSpec.shared_examples "passing checks" do
  describe :passing? do
    it "passes" do
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

RSpec.shared_examples "passing checks (warnings)" do
  describe :passing? do
    it "passes" do
      expect(check).to be_passing
    end
  end
  describe :call do
    it "doesn't add a warning" do
      expect {
        check.call(report_status)
      }.not_to change(report_status, :warning_count)
    end
  end
end

RSpec.shared_examples "failing checks" do
  describe :passing? do
    it "doesn't pass" do
      expect(check).not_to be_passing
    end
  end
  describe :call do
    it "adds an error" do
      expect {
        check.call(report_status)
      }.to change(report_status, :error_count).by(1)
    end
  end
end

RSpec.shared_examples "failing checks (warnings)" do
  describe :passing? do
    it "doesn't pass" do
      expect(check).not_to be_passing
    end
  end
  describe :call do
    it "adds a warning" do
      expect {
        check.call(report_status)
      }.to change(report_status, :warning_count).by(1)
    end
  end
end
