# == Schema Information
#
# Table name: chart_attributes
#
#  id                                                                                                                                            :integer          not null, primary key
#  chart_id(Refence to chart)                                                                                                                    :integer          not null
#  position(Display order in scope of chart)                                                                                                     :integer
#  years(Array of years for which to show this attribute in scope of chart; empty (NULL) for all years)                                          :integer          is an Array
#  display_name(Name of attribute for display in chart)                                                                                          :text
#  legend_name(Legend title)                                                                                                                     :text
#  display_type(Type of display, only used for trajectory deforestation plot in place profiles; e.g. area, line)                                 :text
#  display_style(Style of display, only used for trajectory deforestation plot in place profiles; e.g. area-pink, area-black, line-dashed-black) :text
#  state_average(Only used for trajectory deforestation plot in place profiles)                                                                  :boolean          default(FALSE), not null
#  identifier(Identifier used to map this chart attribute to a part of code which contains calculation logic)                                    :text
#
# Indexes
#
#  chart_attributes_chart_id_identifier_key  (chart_id,identifier) UNIQUE
#  chart_attributes_chart_id_idx             (chart_id)
#  chart_attributes_chart_id_position_idx    (chart_id,position) UNIQUE WHERE (identifier IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (chart_id => charts.id) ON DELETE => cascade
#

module Api
  module V3
    class ChartAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      NORMALIZABLE_ATTRIBUTES = [:identifier].freeze

      AREA = 'area'.freeze
      LINE = 'line'.freeze
      DISPLAY_TYPES = [LINE, AREA].freeze
      AREA_DISPLAY_STYLES = ['area-pink', 'area-black'].freeze
      LINE_DISPLAY_STYLES = ['line-dashed-black'].freeze

      belongs_to :chart, optional: false
      has_one :chart_ind, autosave: true
      has_one :chart_qual, autosave: true
      has_one :chart_quant, autosave: true

      validates :position,
                presence: true,
                uniqueness: {scope: :chart},
                if: proc { |chart_attr| chart_attr.identifier.blank? }
      validates :identifier,
                presence: true,
                uniqueness: {scope: :chart},
                if: proc { |chart_attr| chart_attr.position.blank? }
      validates :display_type,
                inclusion: {in: DISPLAY_TYPES, allow_blank: true},
      validates :display_style,
                inclusion: {in: AREA_DISPLAY_STYLES, allow_blank: true},
                if: proc { |chart_attr| chart_attr.display_type == AREA}
      validates :display_style,
                inclusion: {in: LINE_DISPLAY_STYLES, allow_blank: true},
                if: proc { |chart_attr| chart_attr.display_type == LINE}
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:chart_ind, :chart_qual, :chart_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_ind, scope: [:chart_id, :state_average],
                     if: :new_chart_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_qual, scope: [:chart_id, :state_average],
                     if: :new_chart_qual_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_quant, scope: [:chart_id, :state_average],
                     if: :new_chart_quant_given?

      after_commit :refresh_dependents

      stringy_array :years
      manage_associated_attributes [:chart_ind, :chart_qual, :chart_quant]

      def self.yellow_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::ChartAttribute.refresh
        refresh_actor_basic_attributes
      end

      def refresh_actor_basic_attributes
        return unless saved_change_to_identifier? ||
          saved_change_to_chart_id?

        # Update previous NodeWithFlows
        # The behaviour is the same if the identifier or the chart_id changes
        if chart_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            chart_id_before_last_save
          )
        end

        # If we have just updated the identifier, it has already been updated
        return unless saved_change_to_chart_id

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(chart_id)
      end

      def update_node_with_flows_actor_basic_attributes(chart_id)
        chart = Api::V3::Chart.find(chart_id)
        profile = chart.profile
        context_node_type = profile.context_node_type
        context = context_node_type.context
        nodes = context_node_type.node_type.nodes
        node_with_flows = Api::V3::Readonly::NodeWithFlows.
          without_unknowns.
          without_domestic.
          where(context_id: context.id, id: nodes.map(&:id))
        NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
          node_with_flows.map(&:id)
        )
      end

      private_class_method def self.active_ids
        Api::V3::ChartInd.distinct.pluck(:chart_attribute_id) +
          Api::V3::ChartQual.distinct.pluck(:chart_attribute_id) +
          Api::V3::ChartQuant.distinct.pluck(:chart_attribute_id)
      end
    end
  end
end
