import { Request, Response } from 'express';

import User from '../models/userModel';
import { errorResponseHandler, successResponseHandler } from '../utils';

export const getAllUsers = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    try {
        const users = await User.find( { _id: { $ne: id } } ).populate('friends');
        
        const usersList = users.map(user => {
            const { _id, email, personalDetails: { firstName, lastName, photo, DOB, location }, friends, createdAt, fullName, getGender } = user;
            return {
                _id,
                email,
                fullName,
                personalDetails: {
                    firstName,
                    lastName,
                    photo,
                    gender: getGender,
                    DOB,
                    location
                },
                friends,
                createdAt
            }
        });

        return successResponseHandler(res, usersList);
    }catch(error) {
        return errorResponseHandler(res, error.message);
    }
}

export const getUser = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    try {
        const user = await User.findById(id).populate('friends');
        return successResponseHandler(res, user);
    }catch(error) {
        return errorResponseHandler(res, error.message);
    }
}

export const updateUser = async(req: Request, res: Response) => {
    const { locals: { id, data} } = res;
    try {
        await User.findByIdAndUpdate(id, data);
        return successResponseHandler(res, data);
    } catch(error) {
        return errorResponseHandler(res, error.message);
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    try {
        await User.findByIdAndDelete(id);
        return successResponseHandler(res, 'User deleted Successfully');
    }catch(error) {
        return errorResponseHandler(res, error.message);
    }
}   