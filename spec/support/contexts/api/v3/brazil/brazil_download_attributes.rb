shared_context "api v3 brazil download attributes" do
  include_context "api v3 quals"
  include_context "api v3 quants"
  include_context "api v3 brazil soy context"
  include_context "api v3 brazil beef context"

  let!(:api_v3_deforestation_v2_download_attribute) do
    download_attribute = Api::V3::DownloadQuant.
      includes(:download_attribute).
      where(
        "download_attributes.context_id" => api_v3_brazil_soy_context.id,
        quant_id: api_v3_deforestation_v2.id
      ).first&.download_attribute
    unless download_attribute
      download_attribute = FactoryBot.create(
        :api_v3_download_attribute,
        context: api_v3_brazil_soy_context,
        display_name: "DEFORESTATION",
        position: 2
      )
      FactoryBot.create(
        :api_v3_download_quant,
        download_attribute: download_attribute,
        quant: api_v3_deforestation_v2
      )
    end
    download_attribute
  end

  let!(:api_v3_zero_deforestation_download_attribute) do
    download_attribute = Api::V3::DownloadQual.
      includes(:download_attribute).
      where(
        "download_attributes.context_id" => api_v3_brazil_soy_context.id,
        qual_id: api_v3_zero_deforestation.id
      ).first&.download_attribute
    unless download_attribute
      download_attribute = FactoryBot.create(
        :api_v3_download_attribute,
        context: api_v3_brazil_soy_context,
        display_name: "ZERO DEFORESTATION",
        position: 3
      )
      FactoryBot.create(
        :api_v3_download_qual,
        download_attribute: download_attribute,
        qual: api_v3_zero_deforestation
      )
    end
    download_attribute
  end

  let!(:api_v3_beef_download_attribute) do
    download_attribute = Api::V3::DownloadQuant.
      includes(:download_attribute).
      where(
        "download_attributes.context_id" => api_v3_brazil_beef_context.id,
        quant_id: api_v3_fob.id
      ).first&.download_attribute
    unless download_attribute
      download_attribute = FactoryBot.create(
        :api_v3_download_attribute,
        context: api_v3_brazil_beef_context,
        display_name: "FOB",
        position: 1
      )
      FactoryBot.create(
        :api_v3_download_quant,
        download_attribute: download_attribute,
        quant: api_v3_fob
      )
    end
    download_attribute
  end
end
