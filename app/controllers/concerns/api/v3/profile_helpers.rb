module Api
  module V3
    module ProfileHelpers
      extend ActiveSupport::Concern

      private

      def load_node
        load_readonly_node
        @node = Api::V3::Node.find(@readonly_node.id)
      end

      def set_year
        node_years = @readonly_node.years
        raise ActiveRecord::RecordNotFound unless node_years.any?

        year = params[:year]&.to_i
        @year =
          if year && node_years.include?(year)
            year
          else
            node_years.last
          end
      end
    end
  end
end
