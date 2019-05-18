module Api
  module V3
    module Dashboards
      module CallWithQueryTerm
        def call_with_query_term(query_term, options = {})
          tsquery = "to_tsquery('simple', ''' ' || '#{query_term}' || ' ''' || ':*')"
          tsrank = "ts_rank(name_tsvector, #{tsquery}, 0)"
          if options[:include_country_id]
            @query = @query.select(:country_id).group(:country_id)
          end
          @query = @query.
            select(Arel.sql(tsrank)).
            group(Arel.sql(tsrank)).
            where("name_tsvector @@ #{tsquery}").
            except(:order).
            order(Arel.sql("#{tsrank} DESC"))
        end
      end
    end
  end
end
