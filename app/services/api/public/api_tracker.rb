module Api
  module Public
    class ApiTracker
      # @param path [String] e.g. /api/public/nodes/sources
      # @param options [Hash]
      # @option options [Array<String>] :commodities e.g. [SOY]
      # @option options [Array<Integer] :commodities_ids
      # @option options [Array<String>] :countries e.g. [BR]
      # @option options [Array<Integer] :countries_ids
      # @option options [Array[String]] :node_types e.g. [BIOME]
      # @option options [Array<Integer>] :nodes_ids
      # @option options [Array<Integer>] :attributes_ids
      # @option options [Integer] :start_year
      # @option options [Integer] :end_year
      # @param elapsed [Float] elapsed_seconds
      def initialize
        key = ENV['GOOGLE_ANALYTICS_KEY']
        unless key
          error = 'GOOGLE_ANALYTICS_KEY not set'
          Rails.logger.error error
          Appsignal.send_error(error)
          return
        end

        @tracker = Staccato.tracker(key, nil, ssl: true)
      end

      def call(path, options, elapsed_seconds)
        return unless @tracker

        options.symbolize_keys!
        category = 'Public API v1'
        # set action based on path
        action = path.sub(/^\/api\/public\//, '')
        # set label based on selected filter params
        label = [
          commodities(options),
          countries(options),
          node_types(options),
          nodes(options),
          geo_ids(options),
          attributes(options),
          years(options)
        ].compact.join(' / ')
        value = (elapsed_seconds * 1000).to_i # milliseconds
        tracker_options = {
          category: 'Public API V1',
          action: action,
          label: label,
          value: value
        }
        @tracker.event(tracker_options)
      end

      private

      def commodities(options)
        # if the key is present in the options, means endpoint supports filtering by commodity
        accepts_filter = options.key?(:commodities) || options.key?(:commodities_ids)
        return nil unless accepts_filter

        values = commodities_values(options[:commodities], options[:commodities_ids])
        format_label_part('COMMODITY', values)
      end

      def commodities_values(commodities_names, commodities_ids)
        commodities = commodities_names || []
        return commodities unless commodities_ids && commodities_ids.any?

        commodities += commodities_ids.map { |id| Api::V3::Commodity.find_by_id(id)&.name }
      end

      def countries(options)
        # if the key is present in the options, means endpoint supports filtering by country
        accepts_filter = options.key?(:countries) || options.key?(:countries_ids)
        return nil unless accepts_filter

        values = countries_values(options[:countries], options[:countries_ids])
        format_label_part('COUNTRY', values)
      end

      def countries_values(countries_names, countries_ids)
        countries = countries_names || []
        return countries unless countries_ids && countries_ids.any?

        countries += countries_ids.map { |id| Api::V3::Country.find_by_id(id)&.iso2 }
      end

      def node_types(options)
        return nil unless options.key?(:node_types)

        values = options[:node_types] || []
        format_label_part('NODE TYPE', values)
      end

      def nodes(options)
        # if the key is present in the options, means endpoint supports filtering by node
        accepts_filter = options.key?(:nodes) || options.key?(:nodes_ids)
        return nil unless accepts_filter

        values = nodes_values(options[:nodes], options[:nodes_ids])
        format_label_part('NODE', values)
      end

      def nodes_values(nodes_names, nodes_ids)
        nodes = nodes_names || []
        return nodes unless nodes_ids && nodes_ids.any?

        nodes_ids.map { |id| Api::V3::Node.find_by_id(id)&.name }
      end

      def geo_ids(options)
        return nil unless options[:geo_ids] && options[:geo_ids].any?

        values = options[:geo_ids]
        format_label_part('GEO ID', values)
      end

      def attributes(options)
        return nil unless options[:attributes_ids] && options[:attributes_ids].any?

        values = options[:attributes_ids].map { |id| Api::V3::Readonly::Attribute.find_by_id(id)&.name }
        format_label_part('ATTRIBUTE', values)
      end

      def years(options)
        return nil unless options[:start_year]

        values = [options[:start_year], options[:end_year]].compact
        format_label_part('YEARS', values, sort: false, separator: '-')
      end

      # @param name [String]
      # @param values [Array<String>]
      # @param options [Hash]
      # @option options [Boolean] :sort
      # @option options [String] :separator
      def format_label_part(name, values, options = {})
        return "#{name}: ALL" unless values.any?

        sort =
          if !options[:sort].nil?
            options[:sort]
          else
            true
          end
        separator =
          if !options[:separator].nil?
            options[:separator]
          else
            ','
          end
        values = values.compact
        values = values.sort if sort
        "#{name}: #{values.join(separator)}"
      end
    end
  end
end
