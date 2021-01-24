import Joi from '@hapi/joi';

export const commentSchema = {
    createCommentSchema: Joi.object({
        post_id: Joi.string().length(24).hex().required(),
        body: Joi.string().min(1).required(),
        type: Joi.string().optional()
    }),

    updateCommentSchema: Joi.object({
        comment_id: Joi.string().length(24).required(),
        body: Joi.string().min(1).required()
    }),

    deleteCommentSchema: Joi.object({
        post_id: Joi.string().length(24).required(),
        comment_id: Joi.string().length(24).required()
    })
}