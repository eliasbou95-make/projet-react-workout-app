import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

/**
 * Changer le mot de passe (le mot de passe actuel est vérifié dans le contrôleur)
 */
export const changePasswordValidator = vine.create({
  currentPassword: vine.string(),
  newPassword: password(),
})

/**
 * Changer l'email (le mot de passe est vérifié dans le contrôleur ; le nouvel email doit être libre)
 */
export const changeEmailValidator = vine.create({
  password: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
})

/**
 * Supprimer le compte (le mot de passe est vérifié dans le contrôleur)
 */
export const deleteAccountValidator = vine.create({
  password: vine.string(),
})
