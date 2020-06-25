# Module responsible for deriving details from top profile
# and assigning them to the new record
module Api
  module V3
    module TopProfiles
      class DeriveTopProfileDetails
        attr_reader :top_profile

        class << self
          def call(top_profile)
            new(top_profile).call
          end
        end

        def initialize(top_profile)
          @top_profile = top_profile
        end

        def call
          assign_profile_type
          assign_year
          assign_summary
        end

        private

        def assign_profile_type
          top_profile.profile_type = profile_type
        end

        def assign_year
          top_profile.year = year
        end

        def assign_summary
          service = [
            'Api', 'V3', profile_type.pluralize.capitalize, 'BasicAttributes'
          ].join('::').constantize
          top_profile.summary = service.new(
            top_profile.context, node, year
          ).call[:summary]
        rescue NameError
          top_profile.summary = ''
        rescue
          raise
        end

        def node
          top_profile.node
        end

        def readonly_node
          Api::V3::Readonly::NodeWithFlows.find(node.id)
        end

        def profile_type
          readonly_node.profile
        end

        def year
          readonly_node.years.max
        end
      end
    end
  end
end
