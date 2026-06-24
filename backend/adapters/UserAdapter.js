class UserAdapter {

    static adapt(user) {
        if (!user){
            return null;
        }
        return {


            name: user.name,

            email: user.email,

            password: user.password,

            admin: user.admin ?? false,

            critic: user.critic ?? false,

        };
    }

}

module.exports = UserAdapter;