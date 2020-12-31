import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import { auth } from '../errors/index';
import { signToken } from '../helpers/generateToken';
import { successResponseHandler, errorResponseHandler } from '../utils/index';

const { ENTER_ALL_FIELDS_WARNING } = auth;

// Create and Send Token
const createSendToken = (user: Pick<IUser, 'id' | 'password'>, statusCode: number, req: any, res: any) => {
    const { id } = user;
    const token = signToken(id);
    
    if(!process.env.JWT_COOKIE_EXPIRES_IN){
        process.exit(1);
    }

    res.cookie('jwt', token, {
        expires: new Date( Date.now().valueOf() + <any>process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ),
        httpOnly: true,
        secure: req.secure,
        credentials: 'include'
    });

    const responseObj = { token, id }

    successResponseHandler(res, responseObj);
}

// Signup
export const signUp = async(req: Request, res: Response) => {
    const { body, 
            body: { email, password, passwordConfirm, 
            personalDetails: { firstName, lastName, gender } }} = req;
    let errors: Array<object> = [];

    if(!email || !password || !passwordConfirm || !firstName || !lastName || !gender) {
        errors.push({ msg: ENTER_ALL_FIELDS_WARNING });
    }
    
    if(errors.length > 0) {
        errorResponseHandler(res, errors);
    } else {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            errors.push({ msg: 'Email already exists' });
            errorResponseHandler(res, errors);
        } else {
            try {
                const newUser = await User.create(body);
                const responseObj = { msg: 'User Registered Successfully' }
                successResponseHandler(res, responseObj);
            } catch(error) {
                errorResponseHandler(res, error.message);
            }
        }
    }
}

// Login
export const login = async(req: Request, res: Response) => {
    const { body: { email, password } } = req;
    
    let errors = [];
    if(!email || !password) {
        errors.push({ msg: ENTER_ALL_FIELDS_WARNING });
    }

    if(errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        const existingUser = await User.findOne({ email }).select('password');

        if(!existingUser || !(await existingUser.comparePassword(password)) ) {
            console.log('User doesnot exists')            
        } else {
            console.log('User exists', existingUser._id)
            const userObj = {
                id: existingUser._id,
                password: existingUser.password
            }
            createSendToken(userObj, 200, req, res);
        }
    }
}

// Logout
export const logout = async(req: Request, res: Response) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    const responseObj = { token: null, msg: 'User Logged Out Successfully' };
    successResponseHandler(res, responseObj);
}

// Forgot Password
export const fogotPassword = async() => {

}

// Reset Password
export const resetPassword = async() => {

}

// Update Password
export const updatePassword = async() => {

}

//Test if token authentication is working or not
export const dashBoard = async(req: Request, res: Response) => {
    res.status(200).json({ msg: 'Hello from Dashboard!!' })
}