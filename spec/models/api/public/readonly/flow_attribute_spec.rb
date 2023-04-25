require "rails_helper"

RSpec.describe Api::Public::Readonly::FlowAttribute, type: :model do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true)
    Api::Public::Readonly::FlowAttribute.refresh(sync: true)
  end

  it "contains information about the attributes on the flows" do
    flow_attributes = Api::Public::Readonly::FlowAttribute.all
    expect(flow_attributes.size).not_to eql 0

    flow_attributes_size = Api::V3::Readonly::Attribute.
      select("flow_quants.quant_id", "flows.context_id").
      joins("INNER JOIN flow_quants ON " \
            "flow_quants.quant_id = attributes.original_id").
      joins("INNER JOIN flows ON flow_quants.flow_id = flows.id").
      group("flow_quants.quant_id", "flows.context_id").
      to_a.size
    expect(flow_attributes.size).to eql flow_attributes_size
  end
end
