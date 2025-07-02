import User from '../models/User.js';

async function seedDummyUser() {
    let user = await User.findOne({ email: 'test@test.com' });

    if (!user) {
        const dummyUser = new User({
            username: 'emilys',
            email: 'test@test.com',
            password: 'emilyspass',
            firstName: 'Emily',
            lastName: 'Johnson',
            gender: 'female',
            image: 'https://dummyjson.com/icon/emilys/128',
            createdAt: new Date(),
        });

        user = await dummyUser.save();
        console.log('Dummy user created.');
    } else {
        console.log('Dummy user already exists.');
    }

    return user;
}

export default seedDummyUser;
