import Joi from '@hapi/joi';

export const reactionSchema = Joi.object({
    post_id: Joi.string().length(24).hex().required(),
    type: Joi.string().required()
});