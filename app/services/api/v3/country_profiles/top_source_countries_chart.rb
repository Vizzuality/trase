module Api
  module V3
    module CountryProfiles
      class TopSourceCountriesChart
        include Api::V3::Profiles::AttributesInitializer

        # @param contexts [Array<Api::V3::Context>]
        # @param node [Api::V3::Readonly::Node]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        # @option profile_options [Boolean] include_other
        def initialize(contexts, node, year, profile_options)
          # this is a bit of bandaid to support cross context charts
          # even though profile objects are linked to a single context
          # @contexts = all the contexts to get data from
          # @context = one of those contexts to get the profile from
          # TODO: this needs rethinking
          @contexts = contexts
          @commodity = node.commodity
          @node = node
          @year = year
          @context = @node.context

          profile_type = Api::V3::Profile::COUNTRY
          chart_identifier = :country_top_consumer_countries
          node_type_identifier = 'source'
          initialize_chart_config(profile_type, nil, chart_identifier)

          @top_node_type = @chart_config.named_node_type(node_type_identifier)
          unless @top_node_type
            raise ActiveRecord::RecordNotFound.new(
              "Chart node type \"#{node_type_identifier}\" not found"
            )
          end
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end
        end

        def call
          initialize_com_trade_top_countries
          initialize_top_nodes
          target_nodes = target_nodes_formatted

          {
            name: @node.name,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: target_nodes
          }
        end

        private

        def top_nodes_list
          return @top_nodes_list if defined? @top_nodes_list

          @top_nodes_list = Api::V3::Profiles::CrossContextTopNodesList.new(
            @contexts,
            @top_node_type,
            @node,
            year_start: @year,
            year_end: @year
          )
        end

        def initialize_top_nodes
          @top_nodes = top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: false,
            limit: 10
          )
          @top_nodes_by_iso2 = Hash[@top_nodes.map { |n| [n.geo_id, n]}]
        end

        def initialize_com_trade_top_countries
          @com_trade_top_countries =
            Api::V3::Readonly::CountriesComTradePartnerAggregatedIndicator.
              where(
                iso2: @node.geo_id,
                year: @year,
                activity: 'importer',
                commodity_id: @commodity.id
              ).
              order(quantity: :desc).
              limit(10)
        end

        def target_nodes_formatted
          # lazy
          country_nodes = Api::V3::Node.
            joins(:node_type).
            where(
              'node_types.name' => [NodeTypeName::COUNTRY, NodeTypeName::COUNTRY_OF_PRODUCTION]
            )
          country_names_by_iso2 = Hash[
            country_nodes.map { |n| [n.geo_id, n.name] }
          ]
          result = []
          @com_trade_top_countries.each do |com_trade_record|
            result << {
              geo_id: com_trade_record.partner_iso2,
              name: country_names_by_iso2[com_trade_record.partner_iso2],
              value: com_trade_record.quantity
            }
          end
          @top_nodes.each do |trase_top_node|
            result << {
              node_id: trase_top_node['node_id'],
              geo_id: trase_top_node['geo_id'],
              name: trase_top_node['name'],
              value: trase_top_node['value']
            }
          end
          # sort and take top 10
          result.sort! { |a, b| a[:value] <=> b[:value] }
          result = result[0..9]
          @all_nodes_total = result.map { |n| n[:value] }.inject(:+)

          result.map do |record|
            record[:height] = record[:value] / @all_nodes_total
          end
          result
        end
      end
    end
  end
end
