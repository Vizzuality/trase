module Api
  module V3
    module Import
      class Importer
        # order matters a lot in here
        ALL_TABLES = [
          {table_class: Api::V3::Country, yellow_tables: [Api::V3::CountryProperty]},
          {table_class: Api::V3::Commodity},
          {table_class: Api::V3::Context,
            yellow_tables: [
              Api::V3::ContextProperty,
              Api::V3::ContextualLayer,
              Api::V3::CartoLayer,
              Api::V3::DownloadAttribute,
              Api::V3::MapAttributeGroup,
              Api::V3::MapAttribute,
              Api::V3::RecolorByAttribute,
              Api::V3::ResizeByAttribute
          ]},
          {table_class: Api::V3::NodeType},
          {table_class: Api::V3::ContextNodeType,
            yellow_tables: [
              Api::V3::ContextNodeTypeProperty,
              Api::V3::Profile,
              Api::V3::Chart,
              Api::V3::ChartAttribute
            ]
          },
          {table_class: Api::V3::DownloadVersion},
          {table_class: Api::V3::Node, yellow_tables: [Api::V3::NodeProperty]},
          {table_class: Api::V3::Ind,
            yellow_tables: [
              Api::V3::IndProperty,
              Api::V3::MapInd,
              Api::V3::ChartInd,
              Api::V3::RecolorByInd
            ]
          },
          {table_class: Api::V3::NodeInd},
          {table_class: Api::V3::Qual,
            yellow_tables: [
              Api::V3::QualProperty,
              Api::V3::DownloadQual,
              Api::V3::ChartQual,
              Api::V3::RecolorByQual
            ]
          },
          {table_class: Api::V3::NodeQual},
          {table_class: Api::V3::Quant,
            yellow_tables: [
              Api::V3::QuantProperty,
              Api::V3::DownloadQuant,
              Api::V3::MapQuant,
              Api::V3::ChartQuant,
              Api::V3::ResizeByQuant
            ]
          },
          # {table_class: Api::V3::NodeQuant}, # TODO: data fix
          {table_class: Api::V3::Flow},
          {table_class: Api::V3::FlowInd},
          {table_class: Api::V3::FlowQual} # ,
          # {table_class: Api::V3::FlowQuant} # TODO: data fix
        ]

        def call
          backup
          import
        end

        private

        def backup
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]
            table_class.key_backup
            yellow_tables.each(&:full_backup) if yellow_tables
          end
        end

        def import
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]

            # replace data in the blue table
            ReplaceTable.new(table_class).call

            # restore dependent yellow tables
            if yellow_tables
              yellow_tables.each(&:restore)
            end
          end
        end
      end
    end
  end
end
