import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workout_sessions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // jour du calendrier pour lequel la séance a été lancée (peut différer de completedAt)
      table.date('scheduled_date').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('scheduled_date')
    })
  }
}
