import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // lien vers la fiche du catalogue (null = exo non homologué / ancien)
      table
        .integer('definition_id')
        .unsigned()
        .references('id')
        .inTable('exercise_definitions')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('definition_id')
    })
  }
}