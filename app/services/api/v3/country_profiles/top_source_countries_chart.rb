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
          # @all_nodes_total = top_nodes_list.total(
          #   @volume_attribute,
          #   include_domestic_consumption: false
          # )
          # @target_nodes_total = @top_nodes.inject(0) { |sum, node| sum + node[:value] }
          @top_nodes.each { |n| pp n }
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
              order(:quantity).
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
          @all_nodes_total = 0
          result = @com_trade_top_countries.map do |com_trade_record|
            trase_top_node = @top_nodes_by_iso2[com_trade_record.partner_iso2]

            if trase_top_node
              # puts "FOUND TRASE NODE"
              # puts "COM TRADE VALUE: #{com_trade_record.quantity}"
              # puts "TRASE VALUE: #{trase_top_node['value']}"
              value = trase_top_node['value']
              @all_nodes_total += value
              {
                node_id: trase_top_node['node_id'],
                geo_id: trase_top_node['geo_id'],
                name: trase_top_node['name'],
                # height: value / @all_nodes_total,
                value: value
              }
            else
              value = com_trade_record.quantity
              @all_nodes_total += value
              {
                geo_id: com_trade_record.partner_iso2,
                name: country_names_by_iso2[com_trade_record.partner_iso2],
                value: value
              }
            end
          end
          result.map do |record|
            record[:height] = record[:value] / @all_nodes_total
          end
          result
        end
      end
    end
  end
end
