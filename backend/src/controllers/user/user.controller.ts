import { Request, Response } from 'express';

import { User } from '../../models';
import { errorResponseHandler, successResponseHandler } from '../../utils';

export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const { locals: { id } } = res;
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
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const getUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id } } = res;
        const user = await User.findById(id).populate('friends');
        return successResponseHandler(res, user);
    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const updateUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id, data} } = res;
        await User.findByIdAndUpdate(id, data);
        return successResponseHandler(res, data);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const deleteFriend = async(req:Request, res:Response) => {
    try {
        const { fid } = req.params;
        const { locals: { id } } = res;

        const loggedInUser = await User.findById(id);

        if(!loggedInUser) {
            return errorResponseHandler(res, 'Invalid User');
        }

        const index = loggedInUser.friends.findIndex((friend: any) => friend.friendId === fid);
        loggedInUser.friends.splice(index, 1);
        loggedInUser.save();

        return successResponseHandler(res, 'friend Deleted')

    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id } } = res;
        await User.findByIdAndDelete(id);
        return successResponseHandler(res, 'User deleted Successfully');
    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}   