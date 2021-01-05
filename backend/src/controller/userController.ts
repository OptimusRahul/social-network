import { Request, Response } from 'express';

import { decodeJWT, extractJWT } from '../helpers';
import User from '../models/userModel';

export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const token = extractJWT(req);
        const { id } = decodeJWT(token);

        const users = await User.find( { _id: { $ne: id } } ).populate('friends');
        
        const usersList = users.map(user => {
            const { _id, email, personalDetails: { firstName, lastName, photo, gender, DOB, location }, friends, createdAt, fullName, getGender } = user;
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

        res.send(usersList);
    }catch(error) {
        res.send(error);
    }
}