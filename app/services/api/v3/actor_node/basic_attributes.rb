module Api
  module V3
    module ActorNode
      class BasicAttributes
        attr_reader :attributes

        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @node_type_name = @node&.node_type&.name
          @actor_quals = Dictionary::ActorQuals.new(@node, @year)
          @actor_quants = Dictionary::ActorQuants.new(@node, @year)
          @actor_inds = Dictionary::ActorInds.new(@node, @year)
          @volume_attribute = Dictionary::Quant.instance.get('Volume')

          @attributes = {
            node_name: @node.name,
            column_name: @node_type_name,
            country_name: @context&.country&.name,
            country_geo_id: @context&.country&.iso2
          }

          @attributes = @attributes.merge initialize_dynamic_attributes
          initialize_top_nodes
          @attributes[:summary] = summary
        end

        def summary
          if @node_type_name == NodeTypeName::EXPORTER
            exporter_summary
          else
            importer_summary
          end
        end

        private

        def initialize_dynamic_attributes
          dynamic_attributes = {}
          [@actor_quals, @actor_quants, @actor_inds].each do |attribute_hash|
            attribute_hash.each do |name, attribute|
              dynamic_attributes[name.downcase] = attribute['value']
            end
          end
          dynamic_attributes
        end

        def initialize_top_nodes
          destination_top_nodes = Api::V3::PlaceNode::TopNodesList.new(
            @context, @year, @node,
            other_node_type_name: NodeTypeName::COUNTRY,
            place_inds: @place_inds,
            place_quants: @place_quants
          )
          @main_destination = destination_top_nodes.sorted_list(
            @volume_attribute, false, 1
          ).first
        end

        def exporter_summary
          # For 1st rank:
          # Bunge was the largest exporter of soy in BRAZIL in 2015, accounting for 11,061,393 tons.
          # As an exporter, Bunge sources from 1,136 municipalities, or 44% of the soy production municipalities.
          # The main destination of the soy exported by Bunge is China, accounting for 50% of the total.

          # For all others:
          # Cargill was the 2nd largest exporter of soy in BRAZIL in 2015, accounting for 8,801,294 tons.
          # As an exporter, Cargill sources from 1,224 municipalities, or 48% of the soy production municipalities.
          # The main destination of the soy exported by Cargill is China, accounting for 66% of the total.
          text = summary_of_total_trade_volume('exporter')
          text += summary_of_sources('exporter')
          text += summary_of_destinations('exporter')
          text
        end

        def importer_summary
          # Bunge was the 1st largest importer of soy from BRAZIL in 2015, accounting for 11,061,393 tons.
          # As an importer, Bunge sources soy from 1,136 municipalities, or 44% of the soy production municipalities.
          # The main destination of the soy imported by Bunge is China, accounting for 50% of the total.

          # For all others:
          # Cargill was the 2nd largest importer of soy from BRAZIL in 2015, accounting for 8,801,294 tons.
          # As an importer, Cargill sources from 1,224 municipalities, or 48% of the soy production municipalities.
          # The main destination of the soy imported by Cargill is China, accounting for 66% of the total.
          text = summary_of_total_trade_volume('importer')
          text += summary_of_sources('importer')
          text += summary_of_destinations('importer')
          text
        end

        def summary_of_total_trade_volume(profile_type)
          initialize_trade_volume_for_summary
          text = "#{@node.name.humanize} was the \
#{@trade_total_rank_in_country_formatted}largest #{profile_type} of soy \
#{profile_type.casecmp('exporter').zero? ? 'in' : 'from'} \
#{@context.country.name} in #{@year}, accounting for \
#{@trade_total_current_year_formatted}."
          return text unless @trade_total_perc_difference.present?
          difference_from = if @trade_total_perc_difference.positive?
                              'a ' + helper.number_to_percentage(
                                @trade_total_perc_difference * 100,
                                precision: 0
                              ) + ' increase vs'
                            elsif @trade_total_perc_difference.negative?
                              'a ' + helper.number_to_percentage(
                                -@trade_total_perc_difference * 100,
                                precision: 0
                              ) + ' decrease vs'
                            else
                              'no change from'
                            end
          text + " This is #{difference_from} the previous year."
        end

        def summary_of_sources(profile_type)
          initialize_sources_for_summary
          " As an #{profile_type}, #{@node.name.humanize} sources from \
#{@source_municipalities_count_formatted} municipalities, or \
#{@perc_municipalities_formatted} of the soy production municipalities."
        end

        def summary_of_destinations(profile_type)
          initialize_destinations_for_summary
          if @perc_exports_formatted
            " The main destination of the soy #{profile_type.first(-1)}d by \
#{@node.name.humanize} is #{@main_destination_name.humanize}, accounting for \
#{@perc_exports_formatted} of the total."
          else
            ''
          end
        end

        def initialize_trade_volume_for_summary
          trade_flows_current_year = @node.
            flow_values(@context, @year, @volume_attribute)
          @trade_total_current_year = trade_flows_current_year.sum('value')
          if @trade_total_current_year < 1000
            trade_total_current_year_value = @trade_total_current_year
            trade_total_current_year_unit = 'tons'
            trade_total_current_year_precision = 0
          elsif @trade_total_current_year < 1_000_000
            trade_total_current_year_value = @trade_total_current_year / 1000
            trade_total_current_year_unit = 'thousand tons'
            trade_total_current_year_precision = 0
          else
            trade_total_current_year_value = @trade_total_current_year / 1_000_000
            trade_total_current_year_unit = 'million tons'
            trade_total_current_year_precision = 1
          end

          @trade_total_current_year_formatted = helper.number_with_precision(
            trade_total_current_year_value,
            delimiter: ',', precision: trade_total_current_year_precision
          ) + ' ' + trade_total_current_year_unit

          trade_flows_previous_year = @node.
            flow_values(@context, @year - 1, @volume_attribute)
          @trade_total_previous_year = trade_flows_previous_year.sum('value')
          if @trade_total_previous_year.present? && @trade_total_previous_year.positive?
            @trade_total_perc_difference = (@trade_total_current_year - @trade_total_previous_year) / @trade_total_previous_year
          end

          trade_total_rank_in_country = Api::V3::PlaceNode::CountryRanking.new(@context, @year, @node).
            position_for_attribute(@volume_attribute)
          return unless trade_total_rank_in_country && trade_total_rank_in_country > 1
          @trade_total_rank_in_country_formatted = trade_total_rank_in_country.ordinalize + ' '
        end

        def initialize_sources_for_summary
          stats = Api::V3::ActorNode::FlowsByNodeType.new(
            @context, @year, NodeTypeName::MUNICIPALITY
          )
          municipalities_count = stats.nodes_with_flows_count(@volume_attribute)
          source_municipalities_count = stats.nodes_with_flows_into_node_count(
            @volume_attribute, @node
          )
          @perc_municipalities_formatted = helper.number_to_percentage(
            (source_municipalities_count * 100.0) / municipalities_count, precision: 0
          )
          @source_municipalities_count_formatted = helper.number_with_precision(
            source_municipalities_count, delimiter: ',', precision: 0
          )
        end

        def initialize_destinations_for_summary
          return unless @main_destination.present?
          @main_destination_name = @main_destination.name
          main_destination_exports = @main_destination['value']
          return unless main_destination_exports && @trade_total_current_year &&
              @trade_total_current_year.positive?
          @perc_exports_formatted = helper.number_to_percentage(
            (main_destination_exports * 100.0) / @trade_total_current_year, precision: 0
          )
        end

        def helper
          @helper ||= Class.new do
            include ActionView::Helpers::NumberHelper
          end.new
        end
      end
    end
  end
end
