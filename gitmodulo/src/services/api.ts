const BASE_URL = 'https://api.github.com/users';

export async function fetchGitHubUser(username: string) {
  const response = await fetch(`${BASE_URL}/${username}`);
  
  if (!response.ok) {
    throw new Error(
      response.status === 404 ? 'Usuário não encontrado' : 'Falha na requisição'
    );
  }
  
  return response.json();
}
