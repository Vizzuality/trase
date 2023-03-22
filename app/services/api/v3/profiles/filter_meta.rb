module Api
  module V3
    module Profiles
      class FilterMeta
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        def initialize(params)
          @tabs = Api::V3::NodeTypeTabs.new(
            params.merge(profile_only: true, include: ["profile_type"])
          )
        end

        def call
          {
            data: [
              {
                section: "SOURCES",
                tabs: @tabs.call(ContextNodeTypeProperty::SOURCE_ROLE)
              },
              {
                section: "COMPANIES",
                tabs: @tabs.call(ContextNodeTypeProperty::EXPORTER_ROLE) +
                  @tabs.call(ContextNodeTypeProperty::IMPORTER_ROLE)
              },
              {
                section: "DESTINATIONS",
                tabs: @tabs.call(ContextNodeTypeProperty::DESTINATION_ROLE)
              }
            ]
          }
        end
      end
    end
  end
end
