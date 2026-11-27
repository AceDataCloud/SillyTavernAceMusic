# ACE Music Scene Player for SillyTavern

Play a soundtrack from an existing ACE Music task while you chat. Choose between the tracks returned by a task, adjust the volume with the audio controls, or loop a track until you change chats.

## Install

In SillyTavern, open **Extensions → Install extension**. Paste `https://github.com/AceDataCloud/SillyTavernAceMusic` and install. Reload SillyTavern if prompted. The extension requires a browser and an ACE Music task you can access.

## Play a scene

1. Open a chat and expand **Extensions → ACE Music Scene Player**.
2. Enter your [Ace Data Cloud](https://platform.acedata.cloud/) application token and the ID of an existing ACE Music task.
3. Choose **Load tracks**, select a track and press Play. For example, select the quieter arrangement of a tavern theme and enable **Loop soundtrack** while the scene lasts.
4. For a pending task, use **Load tracks** again later. Playback and the temporary form reset when you switch chats.

The browser sends the token and task ID directly to the ACE Music task lookup endpoint. Playback requests the HTTPS audio URL returned by that endpoint. The token stays in the current page and never enters a chat message or saved extension setting. The extension only retrieves existing tasks and does not request music generation. Audio links may expire.

Support and issues: [GitHub issues](https://github.com/AceDataCloud/SillyTavernAceMusic/issues).
