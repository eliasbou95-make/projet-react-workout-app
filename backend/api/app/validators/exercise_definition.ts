import vine from "@vinejs/vine";

export const createExerciseDefinitionValidator = vine.create({
    name: vine.string().trim().minLength(1),
    icon: vine.string().trim().nullable().optional(),
    sectionId: vine.number().nullable().optional(),
})
