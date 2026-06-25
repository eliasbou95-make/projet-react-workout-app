import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercise_definitions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // classeur auquel appartient l'exo (null = non classé)
      table
        .integer('section_id')
        .unsigned()
        .references('id')
        .inTable('sections')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('section_id')
    })
  }
}
