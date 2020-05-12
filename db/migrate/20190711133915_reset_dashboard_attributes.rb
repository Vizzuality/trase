class ResetDashboardAttributes < ActiveRecord::Migration[5.2]
  def change
    return if Rails.env.test?

    Api::V3::DashboardsAttribute.all.each(&:destroy)
    # Environmental embargoes
    # Slave labour
    # Unprotected vegetation in private lands
    # Legal reserve deficit
    soc_group = Api::V3::DashboardsAttributeGroup.find_by(name: 'Socio-economic') ||
      Api::V3::DashboardsAttributeGroup.create(
        name: 'Socio-economic',
        position: (Api::V3::DashboardsAttributeGroup.maximum(:position) || 0) + 1
      )
    gov_group = Api::V3::DashboardsAttributeGroup.find_by(name: 'Territorial governance') ||
      Api::V3::DashboardsAttributeGroup.create(
        name: 'Territorial governance',
        position: Api::V3::DashboardsAttributeGroup.maximum(:position) + 1
      )
    [
      {name: 'EMBARGOES_', group: gov_group},
      {name: 'SLAVERY', group: soc_group},
      {name: 'UNPROTECTED_VEG_IN_PRIVATE_LAND', group: gov_group},
      {name: 'LR_DEFICIT_AREA', group: gov_group}
    ].each.with_index do |props, idx|
      da = Api::V3::DashboardsAttribute.create(
        dashboards_attribute_group: props[:group],
        position: idx
      )
      quant = Api::V3::Quant.find_by_name(props[:name])
      next unless quant

      Api::V3::DashboardsQuant.create(quant: quant, dashboards_attribute: da)
    end
    # Api::V3::Readonly::DashboardsAttribute.refresh
  end
end
