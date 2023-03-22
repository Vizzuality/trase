module Api
  module V3
    module Dashboards
      module CallWithQueryTerm
        def call_with_query_term(query_term, options = {})
          # AR sanitisation replaces ' with '' rather than \', which breaks to_tsquery
          # But actually even when quoted correctly, the apostrophe would be treated as whitespace,
          # so better just get rid of it
          query_term = query_term.gsub("'", " ")
          tsquery = ActiveRecord::Base.sanitize_sql_array(
            ["to_tsquery('simple', ? || ? || ? || ':*')", "' ", query_term, " '"]
          )
          tsrank = "ts_rank(name_tsvector, #{tsquery}, 0)"
          if options[:include_country_id]
            @query = @query.select(:country_id).group(:country_id)
          end
          @query = @query.
            select(Arel.sql(tsrank)).
            group(Arel.sql(tsrank)).
            where("name_tsvector @@ #{tsquery}").
            except(:order).
            order(
              ActiveRecord::Base.send(
                :sanitize_sql_for_order,
                [
                  Arel.sql("#{tsrank} DESC, levenshtein(name, ?), name"),
                  query_term
                ]
              )
            )
        end
      end
    end
  end
end
