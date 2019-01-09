# Runs database checks and builds a validation report
module Api
  module V3
    module DatabaseValidation
      class Report
        CHAIN_BUILDERS = [
          ChainBuilders::ContextChainBuilder,
          ChainBuilders::IndChainBuilder,
          ChainBuilders::QualChainBuilder,
          ChainBuilders::QuantChainBuilder,
          ChainBuilders::CountryChainBuilder
        ].freeze

        def call
          @errors_list = ErrorsList.new
          chain.each do |check|
            check.call(@errors_list)
          end
          Api::V3::DatabaseValidationReport.create(
            error_count: @errors_list.error_count,
            warning_count: @errors_list.warning_count,
            report: @errors_list.errors
          )
          @errors_list
        end

        def self.human_readable_rules
          CHAIN_BUILDERS.map(&:human_readable_rules).flatten
        end

        private

        def chain
          chain = []
          CHAIN_BUILDERS.each do |builder|
            chain += builder.build_chain
          end
          chain
        end
      end
    end
  end
end
