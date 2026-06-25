import Section from "#models/section";
import { createSectionValidator } from "#validators/section";
import { HttpContext } from "@adonisjs/core/http";

export default class SectionsController {
  // liste les classeurs de l'utilisateur (dans l'ordre qu'il a choisi)
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return Section.query().where('userId', user.id).orderBy('position', 'asc')
  }

  // crée un nouveau classeur (placé à la fin)
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { name } = await request.validateUsing(createSectionValidator)

    // position = nombre de classeurs déjà présents → le nouveau va à la fin
    const total = await Section.query().where('userId', user.id).count('* as total')
    const position = Number(total[0].$extras.total)

    return Section.create({ userId: user.id, name, position })
  }

  // supprime un classeur (ses exos repassent "non classés" grâce au SET NULL)
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const section = await Section.query()
      .where('userId', user.id)
      .where('id', params.id)
      .firstOrFail()
    await section.delete()
    return { message: 'section supprimée' }
  }
}
