import dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
//const { parsed: envs } = result;
const envs = process.env['GOOGLE_APPLICATION_CREDENTIALS']
console.log(envs);
export default envs;