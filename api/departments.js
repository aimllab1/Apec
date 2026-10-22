import departmentsHandler from '../Backend_API/api/departments.js';

export default async function handler(req, res) {
  return departmentsHandler(req, res);
}
