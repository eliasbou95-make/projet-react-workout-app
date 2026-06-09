import vine from "@vinejs/vine";

export const createWorkoutSessionValidator = vine.create({
    workoutId : vine.number().min(0).max(999),
}

)