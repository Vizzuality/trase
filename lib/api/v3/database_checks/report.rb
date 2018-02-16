# The following checks are included

# for each ind / qual / quant
#   check ind/quant/qual_property present
#   if temporal set check year present, if not set check year absent
#   check tooltip text present (WARN)
module Api
  module V3
    module DatabaseChecks
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
            chain += ContextCheckChain.new(context, @errors_list).chain
            context.context_node_types.each do |context_node_type|
              chain += ContextNodeTypeCheckChain.new(
                context_node_type, @errors_list
              ).chain
            end
            context.resize_by_attributes.each do |resize_by_attribute|
              chain += ResizeByAttributeCheckChain.new(
                resize_by_attribute, @errors_list
              ).chain
            end
            context.recolor_by_attributes.each do |recolor_by_attribute|
              chain += RecolorByAttributeCheckChain.new(
                recolor_by_attribute, @errors_list
              ).chain
            end
            context.download_attributes.each do |download_attribute|
              chain += DownloadAttributeCheckChain.new(
                download_attribute, @errors_list
              ).chain
            end
            context.map_attributes.each do |map_attribute|
              chain += MapAttributeCheckChain.new(
                map_attribute, @errors_list
              ).chain
            end
          end

          chain
        end
      end
    end
  end
end
