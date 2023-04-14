# Check whether or not materialized view is populated; used when refreshing.
module Api
  module V3
    class IsMviewPopulated
      def initialize(mview)
        @mview = mview
        @result = BaseModel.connection.execute(query)
      end

      def call
        return false unless @result.any?
        @result[0]["relispopulated"]
      end

      private

      def query
        BaseModel.send(
          :sanitize_sql_array,
          [
            "SELECT relispopulated FROM pg_class WHERE relname = ?",
            @mview
          ]
        )
      end
    end
  end
end
