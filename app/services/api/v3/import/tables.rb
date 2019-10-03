module Api
  module V3
    module Import
      module Tables
        # order matters a lot in here
        ALL_TABLES = [
          {
            table_class: Api::V3::Country,
            yellow_tables: [
              Api::V3::CountryProperty,
              Api::V3::DashboardTemplateCountry,
              Api::V3::SankeyCardLink
            ]
          },
          {
            table_class: Api::V3::Commodity,
            yellow_tables: [
              Api::V3::DashboardTemplateCommodity,
              Api::V3::TopProfileImage,
              Api::V3::SankeyCardLink
            ]
          },
          {
            table_class: Api::V3::Context,
            yellow_tables: [
              Api::V3::ContextProperty,
              Api::V3::ContextualLayer,
              Api::V3::CartoLayer,
              Api::V3::DownloadAttribute,
              Api::V3::MapAttributeGroup,
              Api::V3::MapAttribute,
              Api::V3::RecolorByAttribute,
              Api::V3::ResizeByAttribute,
              Api::V3::DashboardsAttributeGroup,
              Api::V3::DashboardsAttribute
            ]
          },
          {
            table_class: Api::V3::NodeType,
            yellow_tables: [
              Api::V3::SankeyCardLinkNodeType
            ]
          },
          {
            table_class: Api::V3::ContextNodeType,
            yellow_tables: [
              Api::V3::ContextNodeTypeProperty,
              Api::V3::Profile,
              Api::V3::Chart,
              Api::V3::ChartAttribute,
              Api::V3::ChartNodeType
            ]
          },
          {table_class: Api::V3::DownloadVersion},
          {
            table_class: Api::V3::Node,
            yellow_tables: [
              Api::V3::NodeProperty,
              Api::V3::TopProfile,
              Api::V3::DashboardTemplateSource,
              Api::V3::DashboardTemplateCompany,
              Api::V3::DashboardTemplateDestination,
              Api::V3::SankeyCardLinkNode
            ]
          },
          {
            table_class: Api::V3::Ind,
            yellow_tables: [
              Api::V3::IndProperty,
              Api::V3::MapInd,
              Api::V3::ChartInd,
              Api::V3::RecolorByInd,
              Api::V3::DashboardsInd,
              Api::V3::IndContextProperty,
              Api::V3::IndCountryProperty,
              Api::V3::IndCommodityProperty
            ]
          },
          {table_class: Api::V3::NodeInd},
          {
            table_class: Api::V3::Qual,
            yellow_tables: [
              Api::V3::QualProperty,
              Api::V3::DownloadQual,
              Api::V3::ChartQual,
              Api::V3::RecolorByQual,
              Api::V3::DashboardsQual,
              Api::V3::QualContextProperty,
              Api::V3::QualCountryProperty,
              Api::V3::QualCommodityProperty
            ]
          },
          {table_class: Api::V3::NodeQual},
          {
            table_class: Api::V3::Quant,
            yellow_tables: [
              Api::V3::QuantProperty,
              Api::V3::DownloadQuant,
              Api::V3::MapQuant,
              Api::V3::ChartQuant,
              Api::V3::ResizeByQuant,
              Api::V3::DashboardsQuant,
              Api::V3::QuantContextProperty,
              Api::V3::QuantCountryProperty,
              Api::V3::QuantCommodityProperty
            ]
          },
          {table_class: Api::V3::NodeQuant},
          {table_class: Api::V3::Flow},
          {table_class: Api::V3::FlowInd},
          {table_class: Api::V3::FlowQual},
          {table_class: Api::V3::FlowQuant}
        ].freeze

        # These tables should be checked for zombies after their dependents
        # have been restored. Their dependents are the xxx_inds/quals/quants
        # tables, which have foreign keys to the inds/quals/quants tables,
        # as well as the xxx_attributes table.
        TABLES_TO_CHECK_FOR_ZOMBIES = [
          Api::V3::ChartAttribute,
          Api::V3::DashboardsAttribute,
          Api::V3::DownloadAttribute,
          Api::V3::MapAttribute,
          Api::V3::RecolorByAttribute,
          Api::V3::ResizeByAttribute
        ].freeze
      end
    end
  end
end
