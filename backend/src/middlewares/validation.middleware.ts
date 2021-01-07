import Joi from 'joi';

export const authSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    personalDetails: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        photo: Joi.string(),
        coverImg: Joi.string(),
        gender: Joi.number(),
        DOB: Joi.date(),
        location: {
            work: Joi.string(),
            home: Joi.string()
        }
    })
});

export const friendRequestSchema = Joi.object({
    to: Joi.string().required()
});

export const notificationSchema = Joi.object({

});

export const postSchema = Joi.object({

});

export const commentSchema = Joi.object({

});