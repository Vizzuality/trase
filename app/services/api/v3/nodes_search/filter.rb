module Api
  module V3
    module NodesSearch
      class Filter
        def initialize
          @rel = Api::V3::Readonly::Node.all
        end

        def call(query)
          @rel = @rel.search_by_name(query).limit(100)
        end
      end
    end
  end
end
