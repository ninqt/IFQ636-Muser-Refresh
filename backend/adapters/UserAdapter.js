class UserAdapter {

    static adapt(user) {
        if (!user){
            return null;
        }
        return {


            name: user.name,

            email: user.email,

            admin: user.admin ?? false,

            critic: user.critic ?? false,

        };
    }

}

module.exports = UserAdapter;