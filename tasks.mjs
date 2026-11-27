export const services = new Map([
    ['acemusic', { name: 'ACE Music', kind: 'audio', field: 'audio_url' }],
    ['suno', { name: 'Suno', kind: 'audio', field: 'audio_url' }],
    ['nano-banana', { name: 'Nano Banana', kind: 'image', field: 'image_url' }],
    ['openai', { name: 'GPT Image', kind: 'image', field: 'url' }],
    ['seedream', { name: 'Seedream', kind: 'image', field: 'image_url' }],
    ['flux', { name: 'Flux', kind: 'image', field: 'image_url' }],
    ['seedance', { name: 'Seedance', kind: 'video', field: 'video_url' }],
    ['kling', { name: 'Kling', kind: 'video', field: 'video_url' }],
    ['veo', { name: 'Veo', kind: 'video', field: 'video_url' }],
    ['hailuo', { name: 'Hailuo', kind: 'video', field: 'video_url' }],
]);

export async function retrieveTask(taskId, token, signal, service = 'acemusic') {
    const spec = services.get(service);
    if (!spec) throw new Error('Select a supported service.');
    const response = await fetch('https://api.acedata.cloud/' + service + '/tasks', {
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
    let rows = Array.isArray(result?.data) ? result.data : [];
    if (service === 'seedance') rows = [result?.data?.content];
    if (service === 'kling') rows = [result];
    const tracks = [];
    for (const row of rows) {
        const value = row?.[spec.field];
        if (typeof value !== 'string' || !URL.canParse(value)) continue;
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.username || url.password) continue;
        const title = typeof row.title === 'string' && row.title.trim() ? row.title : spec.name + ' ' + (tracks.length + 1);
        tracks.push({ title, url: url.href });
    }
    const rowStates = [...new Set(rows.map(row => row?.state || row?.status).filter(Boolean))];
    const state = result?.status || result?.state || result?.data?.status || task.state || task.status ||
        (result?.success === false || result?.error ? 'failed' : rowStates.join(', ')) ||
        (task.finished_at || tracks.length || result?.success === true ? 'completed' : 'pending');
    return { state, tracks };
}
