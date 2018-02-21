# Runs database checks and builds a validation report
module Api
  module V3
    module DatabaseValidation
      class Report
        def call
          @errors_list = ErrorsList.new
          chain.each do |check|
            check.call(@errors_list)
          end
          @errors_list
        end

        private

        def chain
          chain = []
          chain += ChainBuilders::ContextChainBuilder.build_chain
          chain += ChainBuilders::IndChainBuilder.build_chain
          chain += ChainBuilders::QualChainBuilder.build_chain
          chain += ChainBuilders::QuantChainBuilder.build_chain
          chain += ChainBuilders::CountryChainBuilder.build_chain
          chain
        end
      end
    end
  end
end
