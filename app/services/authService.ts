export type AuthSession = {
  userId: string;
};

// Simulation limitée à Sophie, car nos mocks ne contiennent que ses données.
// Ce service sera remplacé par l'appel Axios à /api/login.
export async function loginUser(username: string, password: string): Promise<AuthSession> {
  if (username !== "sophiemartin" || password !== "password123") {
    throw new Error("Identifiant ou mot de passe incorrect.");
  }

  return { userId: "user123" };
}
