import { Request, Response } from 'express';

import { User } from '../../models';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { userSuccess, authError } from '../../response';

const { 
    USER_LIST_SUCCESS, 
    LOGGED_IN_DETAILS,
    UPDATE_USER_SUCCESS,
    FRIEND_DELETE_SUCCESS,
    USER_DELETED_SUCCESS
} = userSuccess;

const {
    UNAUTHORIZED_USER
} = authError;

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

        return successResponseHandler(res, USER_LIST_SUCCESS, usersList);
    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const getUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id } } = res;
        const user = await User.findById(id).populate('friends');
        return successResponseHandler(res, LOGGED_IN_DETAILS, user);
    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const updateUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id, data} } = res;
        await User.findByIdAndUpdate(id, data);
        return successResponseHandler(res, UPDATE_USER_SUCCESS, data);
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
            return errorResponseHandler(res, UNAUTHORIZED_USER);
        }

        const index = loggedInUser.friends.findIndex((friend: any) => friend.friendId === fid);
        loggedInUser.friends.splice(index, 1);
        loggedInUser.save();

        return successResponseHandler(res, FRIEND_DELETE_SUCCESS, '')

    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    try {
        const { locals: { id } } = res;
        await User.findByIdAndDelete(id);
        return successResponseHandler(res, USER_DELETED_SUCCESS, '');
    }catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}   