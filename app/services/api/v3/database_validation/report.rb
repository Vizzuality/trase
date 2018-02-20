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
          Api::V3::Context.all.each do |context|
            chain += ChainBuilders::ContextChainBuilder.new(context, @errors_list).chain
            context.context_node_types.each do |context_node_type|
              chain += ChainBuilders::ContextNodeTypeChainBuilder.new(
                context_node_type, @errors_list
              ).chain
            end
            context.resize_by_attributes.each do |resize_by_attribute|
              chain += ChainBuilders::ResizeByAttributeChainBuilder.new(
                resize_by_attribute, @errors_list
              ).chain
            end
            context.recolor_by_attributes.each do |recolor_by_attribute|
              chain += ChainBuilders::RecolorByAttributeChainBuilder.new(
                recolor_by_attribute, @errors_list
              ).chain
            end
            context.download_attributes.each do |download_attribute|
              chain += ChainBuilders::DownloadAttributeChainBuilder.new(
                download_attribute, @errors_list
              ).chain
            end
            context.map_attributes.each do |map_attribute|
              chain += ChainBuilders::MapAttributeChainBuilder.new(
                map_attribute, @errors_list
              ).chain
            end
            context.contextual_layers.each do |contextual_layer|
              chain += ChainBuilders::ContextualLayerChainBuilder.new(
                contextual_layer, @errors_list
              ).chain
            end
          end
          Api::V3::Ind.all.each do |ind|
            chain += ChainBuilders::IndChainBuilder.new(
              ind, @errors_list
            ).chain
          end
          Api::V3::Qual.all.each do |qual|
            chain += ChainBuilders::QualChainBuilder.new(
              qual, @errors_list
            ).chain
          end
          Api::V3::Quant.all.each do |quant|
            chain += ChainBuilders::QuantChainBuilder.new(
              quant, @errors_list
            ).chain
          end
          Api::V3::Country.all.each do |country|
            chain += ChainBuilders::CountryhainBuilder.new(
              country, @errors_list
            ).chain
          end
          chain
        end
      end
    end
  end
end
