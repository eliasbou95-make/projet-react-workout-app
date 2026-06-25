import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // le repos de fin de cycle n'est plus automatique : défaut désactivé
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('cycle_end_rest').notNullable().defaultTo(false).alter()
    })
    // les comptes existants repassent sans repos de fin auto
    this.defer(async (db) => {
      await db.from('users').update({ cycle_end_rest: false })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('cycle_end_rest').notNullable().defaultTo(true).alter()
    })
  }
}
