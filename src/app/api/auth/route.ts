import axios from 'axios';

const authURL = 'https://betacall-backend.onrender.com/api/users';

export const userSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(authURL, { email, password });
    return response;
  } catch (err) {
    return console.error(err);
  }
};
