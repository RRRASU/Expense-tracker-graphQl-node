import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    /// This input structure is crucial , all the inputs are read in the second argument.
    /// user(parent, {userid}) -> parent is the parent resolver, which is not used here.
    user: (_, { userId }) => {
      const user = users.find((user) => user._id === userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, password, gender, name } = input;
        if (!username || !password || !gender || !name) {
          throw new Error("All fields are required");
        }
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
          throw new Error("User already exists");
        }
        // 12345 => $2a$10$... > genSalt(10) > means the hasged is generated with 10 string characted hash code.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Createa aradom avator
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username: username,
          password: hashedPassword,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
          name: name,
        });

        await newUser.save(); // newUser.save() is a mongoose method to save the user in the database.
        await context.login(newUser); /// context.login is provided by graphql passport
        return newUser;
      } catch (error) {
        console.log("Error in signup", error);
        throw new Error(error.mesage || "Internal server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error("All fields are required");
        }
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        // We can use the passport.js to authenticate the user.
        await context.login(user); // context.login is provided by graphql passport
        return user;
      } catch (error) {
        console.log("Error in login", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout(); // context.logout is provided by graphql passport
        const { req, res } = context;
        req.session.destroy((err) => {
            if (err) {
              console.log("Error in destroying session", err);
              throw new Error("Error in destroying session");
            }
        });
        res.clearCookie("connect.sid");

        return {
          message: "Logout successful",
          success: true,
        };
      } catch (error) {
        console.log("Error in logout", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
