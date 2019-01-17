class AddLengthRestrictionToFlowPath < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
          ALTER TABLE flows
            ADD CONSTRAINT flows_path_length_check
              CHECK (ICOUNT(path) > 3)
        SQL
      end
      dir.down do
        execute <<~SQL
          ALTER TABLE flows
            DROP CONSTRAINT IF EXISTS flows_path_length_check
        SQL
      end
    end
  end
end
