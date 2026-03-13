import axios from "axios"

type GET = "/upload-raw" | "/auth" | "/assets";
type POST = "/upload-raw" | "/auth" | "/assets";
type DELETE = "/upload-raw" | "/auth" | "/assets";

export const fetchGet = async (path: GET) => {
  const { data } = await axios.get(`/api${path}`);
  return data
};

export const fetchPost =async (path: POST, body: any)=> {
  const { data } = await axios.post(`/api${path}`, body);
  return data;
};

export const fetchDelete = async (path: DELETE) => {
  const { data } = await axios.delete(`/api${path}`);
  return data;
};