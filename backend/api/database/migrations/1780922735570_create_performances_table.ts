import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'performances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('session_id').unsigned().references('id').inTable('workout_sessions').onDelete('CASCADE')
      table.integer('exercise_id').unsigned().references('id').inTable('exercises').onDelete('CASCADE')
      table.integer('reps')
      table.decimal('weight',6,2)
      table.integer('rest_time')
      table.text ('notes')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}