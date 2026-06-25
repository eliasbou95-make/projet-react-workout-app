import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'day_overrides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      // la séance choisie pour ce jour ; null = repos forcé
      table.integer('workout_id').unsigned().references('id').inTable('workouts').onDelete('CASCADE').nullable()
      table.date('date').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // une seule exception par utilisateur et par jour
      table.unique(['user_id', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}