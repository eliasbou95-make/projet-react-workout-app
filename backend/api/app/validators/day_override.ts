import vine from "@vinejs/vine";

export const upsertDayOverrideValidator = vine.create({
    date: vine.string().trim(),
    workoutId: vine.number().nullable().optional(),
})
