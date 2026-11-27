import { retrieveTask } from './tasks.mjs';

jQuery(() => {
    const drawer = document.createElement('div');
    drawer.className = 'inline-drawer';
    drawer.id = 'ace-music-scene';
    drawer.innerHTML = `
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>ACE Music Scene Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <form>
                <label>ACE Music application token
                    <input name="token" class="text_pole" type="password" autocomplete="off" required>
                </label>
                <label>Existing ACE Music task ID
                    <input name="task" class="text_pole" type="text" autocomplete="off" required>
                </label>
                <button class="menu_button" type="submit">Load tracks</button>
            </form>
            <p role="status" aria-live="polite"></p>
            <div class="ace-tracks" hidden>
                <label>Scene track <select class="text_pole"></select></label>
                <label><input class="ace-loop" type="checkbox"> Loop soundtrack</label>
                <audio controls preload="none"></audio>
            </div>
        </div>`;
    document.getElementById('extensions_settings').append(drawer);

    const form = drawer.querySelector('form');
    const status = drawer.querySelector('[role="status"]');
    const trackPanel = drawer.querySelector('.ace-tracks');
    const choices = drawer.querySelector('select');
    const loop = drawer.querySelector('.ace-loop');
    const audio = drawer.querySelector('audio');
    let active;

    function clearTracks() {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        choices.replaceChildren();
        trackPanel.hidden = true;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = form.elements.token.value.trim();
        const taskId = form.elements.task.value.trim();
        active?.abort();
        const request = new AbortController();
        active = request;
        clearTracks();
        if (!token || !taskId) {
            status.textContent = 'Enter your application token and an existing task ID.';
            return;
        }
        status.textContent = 'Loading tracks…';
        try {
            const { state, tracks } = await retrieveTask(taskId, token, request.signal);
            if (request.signal.aborted) return;
            if (tracks.length === 0) {
                status.textContent = 'Task status: ' + state + '. No playable tracks are available.';
                return;
            }
            for (const track of tracks) choices.add(new Option(track.title, track.url));
            audio.src = choices.value;
            trackPanel.hidden = false;
            status.textContent = tracks.length + (tracks.length === 1 ? ' track available.' : ' tracks available.');
        } catch (error) {
            if (!request.signal.aborted) status.textContent = error.message || 'Unable to load tracks.';
        }
    });
    choices.addEventListener('change', () => { audio.src = choices.value; });
    loop.addEventListener('change', () => { audio.loop = loop.checked; });

    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHAT_CHANGED, () => {
        active?.abort();
        clearTracks();
        form.reset();
        loop.checked = false;
        audio.loop = false;
        status.textContent = '';
    });
});
