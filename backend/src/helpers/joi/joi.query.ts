import Joi, {  } from '@hapi/joi';

export const queryParamsSchema  = {
    id: Joi.string().length(24).required()
}