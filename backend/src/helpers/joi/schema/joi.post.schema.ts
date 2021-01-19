import Joi from '@hapi/joi';

export const postSchema = {
    createPostSchema: Joi.object({
        to: Joi.string().optional(),
        post: Joi.string().min(1).required(),
        scope: Joi.string().required(),
    }),

    updatePostSchema: Joi.object({
        post: Joi.string().min(1).required(),
        scope: Joi.string().optional()
    }),

    reactionSchema: Joi.object({
        from: Joi.string().length(24).required(),
        reaction: Joi.string().required()
    })
}