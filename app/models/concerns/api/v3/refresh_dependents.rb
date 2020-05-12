module Api
  module V3
    module RefreshDependents
      extend ActiveSupport::Concern

      included do
        after_create :refresh_dependents_after_create
        after_update :refresh_dependents_after_update
        after_destroy :refresh_dependents_after_destroy
      end

      def refresh_dependents_after_create
        keys = self.class.blue_foreign_keys.map { |bfk| bfk[:name] }
        key_conditions = keys.map do |key|
          [key, send(key)]
        end
        dependent_classes = self.class.dependent_classes
        dependent_classes.each do |dependent_class|
          Rails.logger.debug "AFTER CREATE #{self.class.table_name } REFRESH #{dependent_class} #{key_conditions}"
          PartialRefreshWorker.perform_async(dependent_class, Hash[key_conditions], Hash[key_conditions])
        end
      end

      def refresh_dependents_after_update
        keys = self.class.blue_foreign_keys.map { |bfk| bfk[:name] }
        key_conditions1 = keys.map do |key|
          if previous_changes[key.to_s]
            [key, previous_changes[key.to_s].first]
          else
            [key, send(key)]
          end
        end
        key_conditions2 = keys.map do |key|
          [key, send(key)]
        end
        dependencies_by_dependent_class =
          Api::V3::RefreshDependencies.instance.grouped_by_dependent_class(self.class.table_name)
        dependencies_by_dependent_class.each do |dependent_class, dependencies|
          columns_with_dependents =
            previous_changes.keys & dependencies.map { |rd| rd[:column_name] }
          next unless columns_with_dependents.any?

          Rails.logger.debug "AFTER UPDATE #{self.class.table_name } REFRESH #{dependent_class} #{key_conditions1} #{key_conditions2}"
          PartialRefreshWorker.perform_async(dependent_class, Hash[key_conditions1], Hash[key_conditions2])
        end
      end

      def refresh_dependents_after_destroy
        keys = self.class.blue_foreign_keys.map { |bfk| bfk[:name] }
        key_conditions = keys.map do |key|
          [key, send(key)]
        end
        dependent_classes =
          Api::V3::RefreshDependencies.instance.dependent_classes(self.class.table_name)
        dependent_classes.each do |dependent_class|
          Rails.logger.debug "AFTER DESTROY #{self.class.table_name } REFRESH #{dependent_class} #{key_conditions}"
          PartialRefreshWorker.perform_async(dependent_class, Hash[key_conditions])
        end
      end
    end
  end
end
