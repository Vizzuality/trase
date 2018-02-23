# Prepares checks to be run on download_attribute objects

# The following checks are included:
#   DONE check years match data in flows
#   DONE check for widows (download_attributes without download_qual or download_quant)
module Api
  module V3
    module DatabaseValidation
      module ChainBuilders
        class DownloadAttributeChainBuilder < AbstractChainBuilder
          checks :declared_years_match_data,
                 association: :download_quant,
                 link: :edit
          checks :declared_years_match_data,
                 association: :download_qual,
                 link: :edit
          checks :has_exactly_one_of,
                 associations: [:download_qual, :download_quant],
                 link: :index

          def self.build_chain(context)
            chain = []
            context.download_attributes.each do |download_attribute|
              chain += new(
                download_attribute, @errors_list
              ).chain
            end
            chain
          end
        end
      end
    end
  end
end
