RSpec.shared_examples "required chart parameters" do
  it "requires country_id" do
    get url, params: filter_params.except(:country_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param country_id missing"
    )
  end
  it "requires commodity_id" do
    get url, params: filter_params.except(:commodity_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param commodity_id missing"
    )
  end
  it "requires cont_attribute_id" do
    get url, params: filter_params.except(:cont_attribute_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param cont_attribute_id missing"
    )
  end
  it "requires start_year" do
    get url, params: filter_params.except(:start_year)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param start_year missing"
    )
  end
end

RSpec.shared_examples "required node values chart parameters" do
  it "requires country_id" do
    get url, params: filter_params.except(:country_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param country_id missing"
    )
  end
  it "requires commodity_id" do
    get url, params: filter_params.except(:commodity_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param commodity_id missing"
    )
  end
  it "requires cont_attribute_id" do
    get url, params: filter_params.except(:cont_attribute_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param cont_attribute_id missing"
    )
  end
  it "requires node_id" do
    get url, params: filter_params.except(:node_id)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param node_id missing"
    )
  end
  it "requires start_year" do
    get url, params: filter_params.except(:start_year)
    expect(@response).to have_http_status(:bad_request)
    expect(JSON.parse(@response.body)).to eq(
      "error" => "param is missing or the value is empty: Required param start_year missing"
    )
  end
end
