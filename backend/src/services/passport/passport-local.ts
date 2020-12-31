import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../../models/userModel';

const authFields = {
    usernameField: 'email', 
    passwordField: 'password', 
    passReqToCallback: true
};
