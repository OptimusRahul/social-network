import Joi from '@hapi/joi';

export const reactionSchema = Joi.object({
    from: Joi.string().length(24).required(),
    post_id: Joi.string().length(24).required(),
    type: Joi.string().required()
});