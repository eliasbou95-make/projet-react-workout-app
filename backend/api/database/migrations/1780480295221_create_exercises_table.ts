import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('workout_id').unsigned()
      .references('id')
      .inTable('workouts')
      .onDelete('CASCADE')

      table.string('name').notNullable()
      table.integer('sets')
      table.integer('reps')
      table.decimal('weight',6,2)
      table.integer('rest_time')
      table.text('notes')
      table.integer('position')


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}