const getGroupById = async (groupId) => {
  try {
    if (groupId) {
      const response = await fetch(
        `http://localhost:5000/groups/groupDetails/${groupId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const group = await response.json();

      return group;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getGroupById;
