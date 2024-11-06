export const baseurl = "https://www.pybreeze.com";

export const postRequest = async (url, body) => {
  try {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("Request body is empty or invalid JSON.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json();
      let message;

      if (data?.message) {
        message = data.message;
      } else {
        message = "An error occurred while making the request.";
      }

      throw new Error(`Error response: ${response.status} - ${message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in postRequest:", error); // Log the error
    throw new Error(error.message);
  }
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();
  if (!response.ok) {
    let message = "Error in fetching data";
    if (data.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
