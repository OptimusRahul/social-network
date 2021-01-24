import Joi from '@hapi/joi';

export const postSchema = {
    createPostSchema: Joi.object().keys({
        to: Joi.string().length(24).hex().optional(),
        post: Joi.string().min(1).required(),
        scope: Joi.string().required(),
    }),

    updatePostSchema: Joi.object({
        post: Joi.string().min(1).required(),
        scope: Joi.string().optional()
    }),

    reactionSchema: Joi.object({
        post_id: Joi.string().length(24).hex().required(),
        type: Joi.string().required()
    })
}