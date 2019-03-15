module Api
  module V3
    module MapLayers
      class DimensionSerializer
        attr_reader :dimension

        class << self
          def call(dimension)
            new(
              dimension
            ).call
          end
        end

        def initialize(dimension)
          @dimension = dimension
        end

        def call
          # rubocop:disable Style/EachWithObject
          dimension.inject({}) do |new_hash, (key, value)|
            new_hash[key.camelize(:lower)] = value
            new_hash
          end
          # rubocop:enable Style/EachWithObject
        end
      end
    end
  end
end
