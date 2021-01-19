import Joi from '@hapi/joi';

export const notificationSchema = Joi.object({
    to: Joi.string().required()
});