namespace :populate do

  task :context_indicators => [:environment] do
    context_indicators = [
      {
        type: 'Ind',
        country: 'BRAZIL',
        commodity: nil,
        name: 'BIODIVERSITY',
        position: 10
      },
      {
        type: 'Ind',
        country: 'BRAZIL',
        commodity: nil,
        name: 'FOREST_500',
        position: 19
      },
      {
        type: 'Ind',
        country: 'BRAZIL',
        commodity: nil,
        name: 'SMALLHOLDERS',
        position: 18
      },
      {
        type: 'Ind',
        country: 'BRAZIL',
        commodity: nil,
        name: 'WATER_SCARCITY',
        position: 9        
      },
      {
        type: 'Qual',
        country: 'BRAZIL',
        commodity: 'SOY',
        name: 'ZERO_DEFORESTATION',
        position: 20
      },
      {
        type: 'Quant',
        country: 'BRAZIL',
        commodity: 'SOY',
        name: 'AGROSATELITE_SOY_DEFOR_',
        position: 7
      },
      {
        type: 'Quant',
        country: 'BRAZIL',
        commodity: nil,
        name: 'GHG',
        position: 8
      },
      {
        type: 'Quant',
        country: 'BRAZIL',
        commodity: nil,
        name: 'POTENTIAL_SOY_RELATED_DEFOR',
        position: 6
      },
      {
        type: 'Quant',
        country: 'BRAZIL',
        commodity: 'SOY',
        name: 'SOY_',
        position: 4
      },
      {
        type: 'Quant',
        country: 'BRAZIL',
        commodity: nil,
        name: 'TOTAL_DEFOR_RATE',
        position: 5
      },
      {
        type: 'Ind',
        country: 'BRAZIL',
        commodity: nil,
        name: 'COMPLIANCE_FOREST_CODE',
        position: 12
      }
    ]
    context_indicators.map do |ci|
      puts "#{ci[:name]} (#{ci[:type]})"
      indicator = case ci[:type]
      when 'Quant'
        Quant.find_by_name(ci[:name])
      when 'Qual'
        Qual.find_by_name(ci[:name])
      when 'Ind'
        Ind.find_by_name(ci[:name])
      end
      next nil if indicator.nil?
      puts 'Indicator found'
      indicator_id = indicator.id

      country_id = Country.find_by_name(ci[:country])
      next nil if country_id.nil?
      puts 'Country found'

      commodity_ids = if ci[:commodity].blank?
        Commodity.pluck(:commodity_id)
      else
        [Commodity.find_by_name(ci[:commodity]).commodity_id]
      end.compact
      next nil? if commodity_ids.empty?
      puts 'Commodity found'

      context_ids = commodity_ids.map do |commodity_id|
        Context.find_by(commodity_id: commodity_id, country_id: country_id).id
      end.compact
      next nil if context_ids.empty?
      puts 'Context found'
      context_ids.map do |context_id|
        ContextIndicator.new(
          context_id: context_id,
          indicator_attribute_type: ci[:type],
          indicator_attribute_id: indicator_id,
          position: ci[:position]
        )
      end
    end.flatten.compact.each{ |ci| puts "saving #{ci.inspect}"; ci.save; puts ci.errors.inspect }
  end

end