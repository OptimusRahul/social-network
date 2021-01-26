import { Strategy } from 'passport-local';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

export default function(passport: any) {
    passport.use(
        new Strategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email }).then(user => {
                if(!user) {
                    return done(null, false, { message: 'Email Not Registered' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password Incorrect' });
                    }
                })
            })
        })
    )
}