const getExpensesByGroupId = async (groupId) => {
  try {
    if (groupId) {
      const response = await fetch(
        `http://localhost:5000/expenses/group/${groupId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const expenses = await response.json();
      console.log(expenses);

      return expenses;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
export default getExpensesByGroupId;
