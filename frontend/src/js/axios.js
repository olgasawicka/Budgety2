import axios from "axios";

export const getData = async (endpoint) => {
  try {
    await axios.get(`http://localhost:4000/${endpoint}`);
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (endpoint, budgetyItem) => {
  try {
    await axios.post(`http://localhost:4000/${endpoint}`, budgetyItem);
  } catch (error) {
    console.log(error);
  }
};

export const deleteItem = async (itemId, endpoint) => {
  try {
    await axios.delete(`http://localhost:4000/${endpoint}/${itemId}`);
  } catch (error) {
    console.log(error);
  }
};
