import Joi from '@hapi/joi';

export const friendRequestSchema = {
    sendfriendRequestSchema: Joi.object({
        to: Joi.string().length(24).hex().required()
    }),
    
    deleteFriendRequestSchema: Joi.object({
        id: Joi.string().length(24).hex().required()
    }),

    acceptFriendRequestSchema: Joi.object({
        request_id: Joi.string().length(24).hex().required()
    })
}
