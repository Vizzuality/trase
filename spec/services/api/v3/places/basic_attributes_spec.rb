require 'rails_helper'

RSpec.describe Api::V3::Places::BasicAttributes do
  include_context 'api v3 brazil municipality place profile'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil flows'
  include_context 'api v3 paraguay department place profile'
  include_context 'api v3 paraguay department quant values'
  include_context 'api v3 paraguay flows'

  describe :call do
    before(:each) do
      Api::V3::Readonly::CommodityAttributeProperty.refresh
      Api::V3::Readonly::CountryAttributeProperty.refresh
      Api::V3::Readonly::ContextAttributeProperty.refresh
      Api::V3::Readonly::Node.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end
    let(:brazil_attributes) { Api::V3::Places::BasicAttributes.new(api_v3_context, api_v3_municipality_node, 2015) }
    let(:paraguay_attributes) { Api::V3::Places::BasicAttributes.new(api_v3_paraguay_context, api_v3_paraguay_department_node, 2015) }

    it 'uses context specific quant values for production percentage calculation' do
      brazil_values = brazil_attributes.call
      paraguay_values = paraguay_attributes.call

      expect(
        brazil_values[:summary]
      ).to_not include('With of the total production')

      expect(
        brazil_values[:summary]
      ).to include('With 100.00% of the total production')

      expect(
        paraguay_values[:summary]
      ).to_not include('With of the total production')

      expect(
        paraguay_values[:summary]
      ).to include('With 100.00% of the total production')
    end

    describe 'Header attributes' do
      let!(:attrs) { brazil_attributes.call }
      let!(:header_attributes) { attrs[:header_attributes] }
      let!(:chart_attributes) {
        api_v3_place_basic_attributes.readonly_chart_attributes
      }

      it 'check header area parameters' do
        area =
          chart_attributes.find_by(identifier: 'area')
        expect(attrs[:area]).not_to eql nil
        expect(header_attributes[:area][:value]).to eql(attrs[:area])
        expect(header_attributes[:area][:name]).to eql(
          area.display_name
        )
        expect(header_attributes[:area][:unit]).to eql(
          area.unit
        )
        expect(header_attributes[:area][:tooltip]).to eql(
          api_v3_place_basic_attributes_area_property.tooltip_text
        )
      end

      it 'check header commodity production parameters' do
        commodity_production =
          chart_attributes.find_by(identifier: 'commodity_production')
        expect(attrs[:commodity_production]).not_to eql nil
        expect(header_attributes[:commodity_production][:value]).to eql(
          attrs[:commodity_production]
        )
        expect(header_attributes[:commodity_production][:name]).to eql(
          commodity_production.display_name
        )
        expect(header_attributes[:commodity_production][:unit]).to eql(
          commodity_production.unit
        )
        expect(header_attributes[:commodity_production][:tooltip]).to eql(
          api_v3_place_basic_attributes_commodity_production_property.tooltip_text
        )
      end

      it 'check header commodity area parameters' do
        expect(header_attributes[:commodity_area][:value]).to eql(
          attrs[:value]
        )
        expect(header_attributes[:commodity_area][:name]).to eql(
          "#{api_v3_context.commodity.name.downcase} land"
        )
        expect(header_attributes[:commodity_area][:unit]).to eql('ha')
        expect(header_attributes[:commodity_area][:tooltip]).to eql(
          'Area of land used to grow soybeans'
        )
      end
    end
  end
end
