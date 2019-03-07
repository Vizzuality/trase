module Api
  module V3
    module Profiles
      module AttributesInitializer
        # @param profile_type [Symbol] either :actor or :place
        # @param parent_identifier [Symbol] parent chart identifier (or nil)
        # @param identifier [Symbol] chart identifier
        def initialize_chart_config(profile_type, parent_identifier, identifier)
          @chart_config = Api::V3::Profiles::ChartConfiguration.new(
            @context,
            @node,
            profile_type: profile_type,
            parent_identifier: parent_identifier,
            identifier: identifier
          )
        end
      end
    end
  end
end
