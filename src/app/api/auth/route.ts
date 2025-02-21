import axios from 'axios';

const authURL = 'https://localhost:8080/api/users';

export const userSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${authURL}/login`, { email, password });
    return response.data;
  } catch (err) {
    return console.error(err);
  }
};
