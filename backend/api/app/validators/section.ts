import vine from "@vinejs/vine";

export const createSectionValidator = vine.create({
    name: vine.string().trim().minLength(1),
})
