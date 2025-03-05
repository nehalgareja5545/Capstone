const getExpensesByUserId = async (userId) => {
  try {
    if (userId) {
      const response = await fetch(
        `http://localhost:5000/expenses/user/${userId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const expenses = await response.json();

      return expenses;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getExpensesByUserId;
