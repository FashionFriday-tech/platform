export async function triggerRevalidation(tag: string) {
  const secret = process.env.REVALIDATION_SECRET || 'super-secret-token';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  try {
    const url = `${frontendUrl}/api/revalidate?secret=${secret}&tag=${tag}`;
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      console.error(`Revalidation failed for tag ${tag}: ${response.statusText}`);
    } else {
      console.log(`Successfully triggered revalidation for tag: ${tag}`);
    }
  } catch (error) {
    console.error(`Error triggering revalidation for tag ${tag}:`, error);
  }
}
