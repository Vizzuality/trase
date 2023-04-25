shared_context "api v3 quals" do
  let(:api_v3_state) do
    q = Api::V3::Qual.find_by_name("STATE")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "STATE"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "State"
      )
    end
    q
  end
  let(:api_v3_biome) do
    q = Api::V3::Qual.find_by_name("BIOME")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "BIOME"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "Biome"
      )
    end
    q
  end
  let(:api_v3_zero_deforestation) do
    q = Api::V3::Qual.find_by_name("ZERO_DEFORESTATION")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "ZERO_DEFORESTATION"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "Zero deforestation commitment (exporters)"
      )
    end
    q
  end
  let(:api_v3_zero_deforestation_link) do
    q = Api::V3::Qual.find_by_name("ZERO_DEFORESTATION_LINK")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "ZERO_DEFORESTATION_LINK"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "Zero deforestation link"
      )
    end
    q
  end
  let(:api_v3_supply_change) do
    q = Api::V3::Qual.find_by_name("SUPPLY_CHANGE")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "SUPPLY_CHANGE"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "Supply change"
      )
    end
    q
  end
  let(:api_v3_supply_change_link) do
    q = Api::V3::Qual.find_by_name("SUPPLY_CHANGE_LINK")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "SUPPLY_CHANGE_LINK"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "Supply change link"
      )
    end
    q
  end
  let(:api_v3_rtrs_member) do
    q = Api::V3::Qual.find_by_name("RTRS_MEMBER")
    unless q
      q = FactoryBot.create(
        :api_v3_qual,
        name: "RTRS_MEMBER"
      )
      FactoryBot.create(
        :api_v3_qual_property,
        qual: q,
        display_name: "RTRS member"
      )
    end
    q
  end
end
