const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

let lastFetch = 0;
const RATE_LIMIT_MS = 1100; // Gmail API: 1 request/sec/user

export async function fetchInboxEmails(accessToken: string, maxResults = 10) {
  // Rate limiting (simple in-memory, per server instance)
  const now = Date.now();
  if (now - lastFetch < RATE_LIMIT_MS) {
    throw new Error('Rate limit exceeded. Please wait before making another request.');
  }
  lastFetch = now;

  try {
    // 1. List message IDs
    const listRes = await fetch(
      `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!listRes.ok) throw new Error('Failed to fetch message list');
    const listData = await listRes.json();

    // 2. Fetch message details in parallel
    const messages = await Promise.all(
      (listData.messages || []).map(async (msg: { id: string }) => {
        const msgRes = await fetch(
          `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=subject&metadataHeaders=from&metadataHeaders=date`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!msgRes.ok) throw new Error('Failed to fetch message details');
        return await msgRes.json();
      })
    );

    return messages;
  } catch (err: any) {
    // Handle and log errors
    console.error('Gmail API error:', err);
    throw new Error('Unable to fetch emails. Please try again later.');
  }
}

export async function archiveEmail(accessToken: string, emailId: string) {
  const res = await fetch(
    `${GMAIL_API_BASE}/users/me/messages/${emailId}/modify`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ removeLabelIds: ['INBOX'] }),
    }
  );
  if (!res.ok) throw new Error('Failed to archive email');
}

export async function deleteEmail(accessToken: string, emailId: string) {
  const res = await fetch(
    `${GMAIL_API_BASE}/users/me/messages/${emailId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) throw new Error('Failed to delete email');
} 