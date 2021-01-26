import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../../models/user.model';

const authFields = {
    usernameField: 'email', 
    passwordField: 'password', 
    passReqToCallback: true
};