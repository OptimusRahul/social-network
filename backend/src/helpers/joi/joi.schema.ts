import Joi from '@hapi/joi';

export const authSchema = {
    signUpSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
        passwordConfirm: Joi.ref('password'),
        personalDetails: Joi.object({
            firstName: Joi.string().required().min(3),
            lastName: Joi.string(),
            photo: Joi.string(),
            coverImg: Joi.string(),
            gender: Joi.number().min(0).max(1).required(),
            DOB: Joi.date(),
            location: {
                work: Joi.string(),
                home: Joi.string()
            }
        })
    }),

    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8)
    }),

    forgotPasswordSchema: Joi.object({
        email: Joi.string().email().required()
    }),

    updatePasswordSchema: Joi.object({
        currentPassword: Joi.string().min(8).required(),
        password: Joi.string().required().min(8),
        passwordConfirm: Joi.ref('password'),
    }),

    updateUserSchema: Joi.object({
        email: Joi.string().email().required(),
        personalDetails: Joi.object({
            firstName: Joi.string().required().min(3),
            lastName: Joi.string(),
            photo: Joi.string(),
            coverImg: Joi.string(),
            gender: Joi.number().min(0).max(1).required(),
            DOB: Joi.date(),
            location: {
                work: Joi.string(),
                home: Joi.string()
            }
        })
    }),

    deleteUserSchema: Joi.object({

    }),

    resetPasswordSchema: Joi.object({
        password: Joi.string().min(8).required(),
        passwordConfirm: Joi.ref('password')
    })
}

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

export const notificationSchema = Joi.object({
    to: Joi.string().required()
});

export const postSchema = Joi.object({
    
});

export const commentSchema = Joi.object({

});