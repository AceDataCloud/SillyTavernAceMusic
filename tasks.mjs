export async function retrieveTask(taskId, token, signal) {
    const response = await fetch('https://api.acedata.cloud/acemusic/tasks', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retrieve', id: taskId }),
        credentials: 'omit',
        redirect: 'error',
        signal,
    });
    if (!response.ok) {
        throw new Error('Task lookup returned HTTP ' + response.status + '. Check the task ID and your application token.');
    }
    const task = await response.json();
    const result = task?.response;
    if (task?.id !== taskId || (result?.task_id != null && result.task_id !== taskId)) {
        throw new Error('The task ID in the response does not match your request.');
    }
    const state = result?.status || task.state || task.status || 'pending';
    const tracks = [];
    for (const item of Array.isArray(result?.data) ? result.data : []) {
        if (typeof item?.audio_url !== 'string' || !URL.canParse(item.audio_url)) continue;
        const url = new URL(item.audio_url);
        if (url.protocol !== 'https:' || url.username || url.password) continue;
        const title = typeof item.title === 'string' && item.title.trim() ? item.title : 'Track ' + (tracks.length + 1);
        tracks.push({ title, url: url.href });
    }
    return { state, tracks };
}
