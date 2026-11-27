import { retrieveTask, services } from './tasks.mjs';

jQuery(() => {
    const drawer = document.createElement('div');
    drawer.className = 'inline-drawer';
    drawer.id = 'ace-music-scene';
    drawer.innerHTML = `
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Ace Scene Media</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <form>
                <label>Media service <select name="service" class="text_pole"></select></label>
                <label>Application token <input name="token" class="text_pole" type="password" autocomplete="off" required></label>
                <label>Existing task ID <input name="task" class="text_pole" autocomplete="off" required></label>
                <button class="menu_button" type="submit">Load media</button>
            </form>
            <p role="status" aria-live="polite"></p>
            <div class="ace-tracks" hidden>
                <label>Scene track <select class="text_pole"></select></label>
                <label><input class="ace-loop" type="checkbox"> Loop soundtrack</label>
                <audio controls preload="none"></audio>
            </div>
            <div class="ace-backdrops" hidden>
                <label>Scene backdrop <select class="text_pole"></select></label>
                <button class="menu_button ace-show" type="button">Show in this chat</button>
                <button class="menu_button ace-clear" type="button">Clear backdrop</button>
            </div>
        </div>`;
    document.getElementById('extensions_settings').append(drawer);

    const form = drawer.querySelector('form');
    const status = drawer.querySelector('[role="status"]');
    const audioPanel = drawer.querySelector('.ace-tracks');
    const visualPanel = drawer.querySelector('.ace-backdrops');
    const audioChoices = audioPanel.querySelector('select');
    const visualChoices = visualPanel.querySelector('select');
    const loop = audioPanel.querySelector('.ace-loop');
    const audio = audioPanel.querySelector('audio');
    let active;
    let visualKind;
    let backdrop;
    for (const [id, spec] of services) form.elements.service.add(new Option(spec.name, id));

    function clearBackdrop() {
        if (backdrop instanceof HTMLVideoElement) {
            backdrop.pause();
            backdrop.removeAttribute('src');
            backdrop.load();
        }
        backdrop?.remove();
        backdrop = undefined;
    }

    function clearAudio() {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        audioChoices.replaceChildren();
        audioPanel.hidden = true;
    }

    function resetInputs() {
        active?.abort();
        form.elements.token.value = '';
        form.elements.task.value = '';
        status.textContent = '';
    }
    form.elements.service.addEventListener('change', resetInputs);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const service = form.elements.service.value;
        const kind = services.get(service).kind;
        const token = form.elements.token.value.trim();
        const taskId = form.elements.task.value.trim();
        active?.abort();
        const request = new AbortController();
        active = request;
        if (!token || !taskId) return;
        status.textContent = 'Loading media…';
        try {
            const { state, tracks } = await retrieveTask(taskId, token, request.signal, service);
            if (request.signal.aborted) return;
            if (!tracks.length) {
                status.textContent = 'Task status: ' + state + '. No HTTPS media links are available.';
                return;
            }
            const choices = kind === 'audio' ? audioChoices : visualChoices;
            choices.replaceChildren(...tracks.map(track => new Option(track.title, track.url)));
            if (kind === 'audio') {
                audio.src = choices.value;
                audioPanel.hidden = false;
            } else {
                visualKind = kind;
                visualPanel.hidden = false;
            }
            status.textContent = tracks.length + (tracks.length === 1 ? ' result available.' : ' results available.');
        } catch (error) {
            if (!request.signal.aborted) status.textContent = error.message || 'Unable to load media.';
        }
    });
    audioChoices.addEventListener('change', () => { audio.src = audioChoices.value; });
    loop.addEventListener('change', () => { audio.loop = loop.checked; });
    visualPanel.querySelector('.ace-show').addEventListener('click', async () => {
        const background = document.getElementById('bg1');
        if (!background || !visualChoices.value) return;
        clearBackdrop();
        const media = document.createElement(visualKind === 'video' ? 'video' : 'img');
        media.className = 'ace-scene-backdrop';
        media.setAttribute('aria-hidden', 'true');
        media.referrerPolicy = 'no-referrer';
        if (visualKind === 'video') {
            media.loop = true;
            media.muted = true;
            media.playsInline = true;
        } else {
            media.alt = '';
        }
        backdrop = media;
        media.addEventListener('error', () => {
            if (backdrop === media) {
                clearBackdrop();
                status.textContent = 'Unable to display this backdrop. The media link may have expired.';
            }
        }, { once: true });
        media.src = visualChoices.value;
        background.append(media);
        if (visualKind === 'video') {
            try { await media.play(); }
            catch {
                if (backdrop === media) {
                    clearBackdrop();
                    status.textContent = 'The video could not play. Check the media link and try again.';
                }
            }
        }
    });
    visualPanel.querySelector('.ace-clear').addEventListener('click', clearBackdrop);
    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHAT_CHANGED, () => {
        resetInputs();
        clearAudio();
        clearBackdrop();
        form.reset();
        loop.checked = false;
        audio.loop = false;
        visualPanel.hidden = true;
        visualChoices.replaceChildren();
    });
});
