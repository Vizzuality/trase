module Api
  module V3
    module CountryProfiles
      class TopSourceCountriesChart
        # @param commodity_id [Integer]
        # @param geo_id [String] 2-letter iso code
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        # @option profile_options [Boolean] include_other
        def initialize(commodity_id, geo_id, year, profile_options)
          @commodity = Api::V3::Commodity.find(commodity_id)
          @geo_id = geo_id
          @year = year
          @nodes = Api::V3::Readonly::NodeWithFlows.where(
            profile: Api::V3::Profile::COUNTRY, commodity_id: commodity_id, geo_id: @geo_id
          ).where("years && ARRAY[?]::INT[]", @year)
          unless @nodes.any?
            raise ActiveRecord::RecordNotFound.new "No nodes with country profile found for commodity #{@commodity.name} node #{@geo_id}"
          end
          @contexts = Api::V3::Context.where(id: @nodes.select(:context_id))

          initialize_nodes_in_context
          initialize_chart_configs_in_context
          initialize_top_node_types_in_context

          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get("Volume")
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new "Quant Volume not found"
          end
        end

        def initialize_nodes_in_context
          @nodes_in_context = {}
          @contexts.each do |context|
            node = Api::V3::Readonly::NodeWithFlows.where(geo_id: @geo_id, context_id: context.id).first
            next unless node

            @nodes_in_context[context.id] = node
          end
        end

        def initialize_chart_configs_in_context
          @chart_configs_in_context = {}
          chart_identifier = :country_top_consumer_countries
          @contexts.each do |context|
            node_in_context = @nodes_in_context[context.id]
            next unless node_in_context

            chart_config = Api::V3::Profiles::ChartConfiguration.new(
              context,
              node_in_context,
              profile_type: Api::V3::Profile::COUNTRY,
              parent_identifier: nil,
              identifier: chart_identifier
            )
            next unless chart_config

            @chart_configs_in_context[context.id] = chart_config
          end
          unless @chart_configs_in_context.any?
            raise ActiveRecord::RecordNotFound.new(
              "Chart \"#{chart_identifier}\" not found"
            )
          end
        end

        def initialize_top_node_types_in_context
          @top_node_types_in_context = {}
          node_type_identifier = "source"
          @contexts.each do |context|
            chart_config = @chart_configs_in_context[context.id]
            next unless chart_config

            top_node_type = chart_config.named_node_type(node_type_identifier)
            next unless top_node_type

            @top_node_types_in_context[context.id] = top_node_type
          end

          unless @top_node_types_in_context.any?
            raise ActiveRecord::RecordNotFound.new(
              "Chart node type \"#{node_type_identifier}\" not found"
            )
          end
        end

        def call
          initialize_com_trade_top_countries
          initialize_top_nodes
          target_nodes = target_nodes_formatted

          {
            name: @nodes.first.name, # if they have the same geo_id, hopefully they have the same name
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: target_nodes
          }
        end

        private

        def top_nodes_lists
          return @top_nodes_lists if defined? @top_nodes_lists

          @top_nodes_lists = @top_node_types_in_context.map do |context_id, top_node_type|
            Api::V3::Profiles::CrossContextTopNodesList.new(
              @contexts.select { |context| context_id == context.id },
              top_node_type,
              @nodes_in_context[context_id],
              year_start: @year,
              year_end: @year
            )
          end
        end

        def initialize_top_nodes
          @top_nodes = top_nodes_lists.map do |top_nodes_list|
            top_nodes_list.sorted_list(
              @volume_attribute,
              include_domestic_consumption: false,
              limit: 10
            )
          end.flatten
          @top_nodes_by_iso2 = @top_nodes.map { |n| [n.geo_id, n] }.to_h
        end

        def initialize_com_trade_top_countries
          @com_trade_top_countries =
            Api::V3::Readonly::CountriesComTradePartnerAggregatedIndicator
              .where(
                iso2: @geo_id,
                year: @year,
                activity: "importer",
                commodity_id: @commodity.id
              )
              .order(quantity: :desc)
              .limit(10)
        end

        def target_nodes_formatted
          # lazy
          country_nodes = Api::V3::Node
            .joins(:node_type)
            .where(
              "node_types.name" => NodeTypeName.destination_country_names + [NodeTypeName::COUNTRY_OF_PRODUCTION]
            )
          country_names_by_iso2 = country_nodes.map { |n| [n.geo_id, n.name] }.to_h
          result = []
          included_countries = Set.new
          @top_nodes.each do |trase_top_node|
            included_countries.add(trase_top_node["geo_id"])
            result << {
              node_id: trase_top_node["node_id"],
              geo_id: trase_top_node["geo_id"],
              name: trase_top_node["name"],
              value: trase_top_node["value"]
            }
          end
          @com_trade_top_countries.each do |com_trade_record|
            next if included_countries.include?(com_trade_record.partner_iso2)

            result << {
              geo_id: com_trade_record.partner_iso2,
              name: country_names_by_iso2[com_trade_record.partner_iso2],
              value: com_trade_record.quantity.to_f / 1000 # conversion from kg
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
