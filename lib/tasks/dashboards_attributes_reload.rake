namespace :dashboards do
  namespace :attributes do
    desc 'Reloads dashboards attributes tables'
    task reload: :environment do
      Api::V3::RefreshDependencies.instance.classes_with_dependents.each do |class_with_dependents|
        class_with_dependents.skip_callback(:create, :after, :refresh_dependents_after_create)
        class_with_dependents.skip_callback(:update, :after, :refresh_dependents_after_update)
        class_with_dependents.skip_callback(:destroy, :after, :refresh_dependents_after_destroy)
      end

      Api::V3::DashboardsInd.delete_all
      Api::V3::DashboardsQual.delete_all
      Api::V3::DashboardsQuant.delete_all
      Api::V3::DashboardsAttribute.delete_all
      Api::V3::DashboardsAttributeGroup.delete_all

      attribute_groups.each.with_index do |properties, idx|
        reload_group(properties, idx)
      end

      Api::V3::RefreshDependencies.instance.classes_with_dependents.each do |class_with_dependents|
        class_with_dependents.set_callback(:create, :after, :refresh_dependents_after_create)
        class_with_dependents.set_callback(:update, :after, :refresh_dependents_after_update)
        class_with_dependents.set_callback(:destroy, :after, :refresh_dependents_after_destroy)
      end
    end

    def reload_group(properties, idx)
      group = Api::V3::DashboardsAttributeGroup.find_by_name(properties[:group])
      group ||= Api::V3::DashboardsAttributeGroup.new(name: properties[:group])
      group.position = idx
      group.save

      attr_idx = 0
      %w(ind qual quant).each do |attribute_type|
        attribute_class = ('Api::V3::' + attribute_type.camelize).constantize
        properties["#{attribute_type}s".to_sym].each do |attribute_name|
          attribute = attribute_class.find_by_name(attribute_name)
          next unless attribute

          dashboards_attribute = Api::V3::DashboardsAttribute.new(
            chart_type: 'line', # TODO: temporary
            dashboards_attribute_group: group,
            position: attr_idx
          )
          dashboards_attribute.send(
            :"build_dashboards_#{attribute_type}",
            "#{attribute_type}_id" => attribute.id,
            dashboards_attribute: dashboards_attribute
          )
          unless dashboards_attribute.valid?
            puts dashboards_attribute.errors.inspect
          end
          dashboards_attribute.save
          attr_idx += 1
        end
      end
    end

    # rubocop:disable Metrics/MethodLength
    def attribute_groups
      [
        {
          group: 'Agricultural',
          inds: %w(
            SOY_YIELD_
            COFFEE_YIELD_
            SOY_AREAPERC
          ),

          quals: %w(
            Commodity
          ),
          quants: %w(
            SOY_TN
            COFFEE_PRODUCTION_
            Volume
          )
        },
        {
          group: 'Environmental',
          inds: %w(
            FOREST_500
            PERC_SOY_ZD_COMMITMENT
            WATER_SCARCITY
            WATER_SHORTAGE_INDEX
          ),
          quals: %w(
            RAINFOREST_ALLIANCE_CERTIFIED_COFFEE
            ZERO_DEFORESTATION
          ),
          quants: %w(
            AGROSATELITE_SOY_DEFOR_
            BIODIVERSITY
            DEFORESTATION_V2
            POTENTIAL_SOY_DEFORESTATION_V2
            FOREST_RISK_COFFEE_2050
            GHG_ALL_SECTORS
            TERRITORIAL_DEFORESTATION_IDEAM
          )
        },
        {
          group: 'Socio-economic',
          inds: %w(
            MULTIDIMENSIONAL_POVERTY_INDEX
            PERC_FARM_GDP_
            GDP_CAP_USD
            HDI
          ),
          quals: [],
          quants: %w(
            SLAVERY
            POPULATION
          )
        },
        {
          group: 'Territorial governance',
          inds: %w(
            SMALLHOLDERS
          ),
          quals: [],
          quants: %w(
            EMBARGOES_
            LR_DEFICIT_AREA
          )
        }
      ]
    end
    # rubocop:enable Metrics/MethodLength
  end
end
