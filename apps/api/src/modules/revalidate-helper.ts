export async function triggerRevalidation(tag: string, path?: string) {
  const secret = (
    process.env.REVALIDATION_SECRET ||
    'f2a7c9e1b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8'
  )
    .replace(/["']/g, '')
    .trim();

  let frontendUrl = (
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://fashionfriday.in' : 'http://localhost:3000')
  )
    .replace(/["']/g, '')
    .trim()
    .replace(/\/+$/, '');

  // Protect against misconfigured localhost URL in production or container environments
  if (
    (frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1')) &&
    (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT || process.env.RENDER)
  ) {
    frontendUrl = 'https://fashionfriday.in';
  }

  try {
    let url = `${frontendUrl}/api/revalidate?secret=${encodeURIComponent(secret)}&tag=${encodeURIComponent(tag)}`;
    if (path) {
      url += `&path=${encodeURIComponent(path)}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': secret,
      },
    });
    if (!response.ok) {
      console.error(
        `Revalidation failed for tag ${tag} (${response.status}): ${response.statusText}`,
      );
    } else {
      console.log(
        `Successfully triggered revalidation for tag: ${tag}${path ? ' (path: ' + path + ')' : ''}`,
      );
    }
  } catch (error) {
    console.error(`Error triggering revalidation for tag ${tag}:`, error);
  }
}
