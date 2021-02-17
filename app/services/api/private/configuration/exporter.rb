module Api
  module Private
    module Configuration
      class Exporter
        # @param event [Api::Private::ConfigurationExportEvent]
        def initialize(event)
          @event = event
        end

        def call
          @event.start!

          data =
            serialized_contexts.
              merge(serialized_commodities).
              merge(serialized_inds).
              merge(serialized_quals).
              merge(serialized_quants).
              merge(serialized_nodes)

          @event.finish!(data)
        rescue => e
          @event.fail!(e)
          raise # TODO: temporarily
        end

        def serialized_contexts
          ActiveModelSerializers::SerializableResource.new(
            contexts,
            each_serializer: Api::Private::ContextSerializer,
            include: '**',
            root: 'contexts'
          ).serializable_hash
        end

        def contexts
          Api::V3::Context.includes(
            :context_property,
            :commodity,
            :country,
            {
              context_node_types: [
                :node_type,
                :context_node_type_property,
                profile: {
                  charts: [
                    chart_attributes: {chart_ind: :ind, chart_qual: :qual, chart_quant: :quant},
                    chart_node_types: :node_type
                  ]
                }
              ],
              recolor_by_attributes: {recolor_by_ind: :ind, recolor_by_qual: :qual},
              resize_by_attributes: {resize_by_quant: :quant},
              download_attributes: {download_qual: :qual, download_quant: :quant},
              map_attribute_groups: {map_attributes: {map_ind: :ind, map_quant: :quant}},
              contextual_layers: :carto_layers,
              top_profiles: :node
            }
          )
        end

        def serialized_commodities
          ActiveModelSerializers::SerializableResource.new(
            commodities,
            each_serializer: Api::Private::CommoditySerializer,
            include: '**',
            root: 'commodities'
          ).serializable_hash
        end

        def commodities
          Api::V3::Commodity.includes(
            sankey_card_links: :country
          )
        end

        def serialized_inds
          ActiveModelSerializers::SerializableResource.new(
            inds,
            each_serializer: Api::Private::IndSerializer,
            include: '**',
            root: 'inds'
          ).serializable_hash
        end

        def inds
          Api::V3::Ind.includes(
            :ind_property,
            {ind_commodity_properties: :commodity},
            {ind_country_properties: :country},
            {ind_context_properties: :context}
          )
        end

        def serialized_quals
          ActiveModelSerializers::SerializableResource.new(
            quals,
            each_serializer: Api::Private::QualSerializer,
            include: '**',
            root: 'quals'
          ).serializable_hash
        end

        def quals
          Api::V3::Qual.includes(
            :qual_property,
            {qual_commodity_properties: :commodity},
            {qual_country_properties: :country},
            {qual_context_properties: :context}
          )
        end

        def serialized_quants
          ActiveModelSerializers::SerializableResource.new(
            quants,
            each_serializer: Api::Private::QuantSerializer,
            include: '**',
            root: 'quants'
          ).serializable_hash
        end

        def quants
          Api::V3::Quant.includes(
            :quant_property,
            {quant_commodity_properties: :commodity},
            {quant_country_properties: :country},
            {quant_context_properties: :context}
          )
        end

        def serialized_nodes
          ActiveModelSerializers::SerializableResource.new(
            nodes,
            each_serializer: Api::Private::NodeSerializer,
            root: 'nodes'
          ).serializable_hash
        end

        def nodes
          Api::V3::Node.includes(:node_property)
        end
      end
    end
  end
end
