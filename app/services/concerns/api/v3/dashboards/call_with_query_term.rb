module Api
  module V3
    module Dashboards
      module CallWithQueryTerm
        def call_with_query_term(query_term)
          tsquery = "to_tsquery('simple', ''' ' || '#{query_term}' || ' ''' || ':*')"
          tsrank = "ts_rank(name_tsvector, #{tsquery}, 0)"
          @query = @query.
            select(Arel.sql(tsrank)).
            group(Arel.sql(tsrank)).
            where("name_tsvector @@ #{tsquery}").
            except(:order).
            order(Arel.sql("#{tsrank} DESC"), name: :asc)
        end
      end
    end
  end
end
