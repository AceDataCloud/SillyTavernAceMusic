# Ace Scene Media for SillyTavern

Play your soundtrack and set an image or muted looping video as the backdrop for the current chat. Bring an existing task from the media service you used to create the scene.

| Scene element | Services |
| --- | --- |
| Soundtrack | ACE Music, Suno |
| Still backdrop | Nano Banana, GPT Image, Seedream, Flux |
| Animated backdrop | Seedance, Kling, Veo, Hailuo |

## Install

Open **Extensions → Install extension** in SillyTavern, paste `https://github.com/AceDataCloud/SillyTavernAceMusic` and install. Reload if prompted. Existing ACE Music Scene Player installations can update in place. The extension requires a browser and an accessible task that returns an HTTPS media URL.

## Set a scene

1. Open a chat and expand **Extensions → Ace Scene Media**. Choose the service that created your task and enter its [Ace Data Cloud](https://platform.acedata.cloud/) application token and task ID.
2. Choose **Load media**. For a soundtrack, select an arrangement, press Play and optionally enable **Loop soundtrack**. For a still or animated backdrop, select a result and choose **Show in this chat**.
3. For example, play a quiet Suno arrangement, switch the service to Nano Banana and load an illustration of the same tavern. The music continues behind the scene. **Clear backdrop** reveals your usual SillyTavern background.
4. To check a pending task, load it again. Changing chats stops playback, removes the temporary backdrop and clears the form.

The browser sends the token and task ID directly to the selected service's task lookup endpoint. It loads media from the HTTPS links returned by the service. Tokens stay in the current page and clear when you change services or chats. The extension never puts a token or result in a chat message or saved setting. It only retrieves existing tasks. Links may expire, and image tasks using base64 output need a URL result for playback.

[Support and issues](https://github.com/AceDataCloud/SillyTavernAceMusic/issues)
