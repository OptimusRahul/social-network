import Joi from '@hapi/joi';

export const friendRequestSchema = {
    sendfriendRequestSchema: Joi.object({
        to: Joi.string().required()
    }),
    
    deleteFriendRequestSchema: Joi.object({
        id: Joi.string().required()
    }),

    acceptFriendRequestSchema: Joi.object({
        request_id: Joi.string().required()
    })
}
