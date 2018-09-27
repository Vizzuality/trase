module Api
  module V3
    module Dashboards
      module CallWithQueryTerm
        def call_with_query_term(query_term)
          tsquery = "to_tsquery('simple', ''' ' || '#{query_term}' || ' ''' || ':*')"
          tsrank = "ts_rank(name_tsvector, #{tsquery}, 0)"
          @query = @query.
            select(tsrank).
            group(tsrank).
            where("name_tsvector @@ #{tsquery}").
            except(:order).
            order("#{tsrank} DESC", name: :asc)
        end
      end
    end
  end
end
