const getGroupsByUserId = async (userId) => {
  try {
    if (userId) {
      const response = await fetch(`http://localhost:5000/groups/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const groups = await response.json();
      return groups;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getGroupsByUserId;
