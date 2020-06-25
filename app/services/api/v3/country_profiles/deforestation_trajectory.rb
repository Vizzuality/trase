module Api
  module V3
    module CountryProfiles
      class DeforestationTrajectory < Api::V3::Profiles::StackedLineChart
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(node, year, profile_options)
          super(
            node.context, node, year, profile_options
          )
        end

        private

        def fetch_lines
          lines = super

          # TODO: this is tmp
          if @years.empty?
            @years = Api::V3::Flow.
              where('path[?] = ?', @node.column_position + 1, @node.id).
              where(context_id: @node.context_id).
              select(:year).
              distinct.
              pluck(:year).
              sort
          end
          lines << {
            name: 'Production',
            legend_name: 'Production',
            legend_tooltip: 'Production',
            type: Api::V3::ChartAttribute::LINE,
            style: Api::V3::ChartAttribute::LINE_DASHED_BLACK,
            values: production_values
          }
          lines
        end

        def production_values
          data = Api::V3::FlowQuant.
            select('flows.year, SUM(value) AS total').
            from('partitioned_flow_quants flow_quants').
            joins(:flow).
            where('flows.path[?] = ?', @node.column_position + 1, @node.id).
            where('flows.context_id' => @node.context_id).
            group(:year)

          data_by_year = Hash[
            data.map { |fq| [fq.year, fq['total']] }
          ]

          years.map { |year| data_by_year[year] }
        end
      end
    end
  end
end
