import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // y a-t-il un jour de repos automatique à la fin du cycle ? (vrai par défaut)
      table.boolean('cycle_end_rest').notNullable().defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cycle_end_rest')
    })
  }
}