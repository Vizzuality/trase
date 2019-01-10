module Api
  module V3
    module Download
      class Parameters
        attr_reader :context, :version, :pivot, :separator, :format, :filters,
                    :download_name, :filename

        def initialize(context, params)
          @context = context
          @version = DownloadVersion.current_version_symbol(@context)
          @filters = {}
          [:years, :e_ids, :i_ids, :c_ids, :filters].each do |key|
            @filters[key] = params[key] if params[key]
          end
          @pivot = params[:pivot].present?
          @separator =
            if params[:separator].present? && params[:separator] == 'semicolon'
              ';'
            else
              ','
            end
          @format =
            if params[:format] && params[:format] == 'json'
              'json'
            else
              'csv'
            end
          @download_name = download_name_parts.compact.join('_')
          @filename = @download_name + '.zip'
        end

        def precompute?
          @filters.none?
        end

        def separator_name
          if @separator == ';'
            'semicolon'
          else
            'comma'
          end
        end

        def pivot_name
          if @pivot
            'pivot'
          else
            'table'
          end
        end

        def download_name_parts
          [
            @context.country.name,
            @context.commodity.name,
            @version,
            pivot_name[0] + separator_name[0]
          ]
        end
      end
    end
  end
end
