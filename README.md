# Ace Scene Media for SillyTavern

Play your soundtrack and set an image or muted looping video as the backdrop for the current chat. Bring an existing task from the media service you used to create the scene.

| Scene element | Services |
| --- | --- |
| Soundtrack | ACE Music, Suno |
| Still backdrop | Nano Banana, GPT Image, Seedream, Flux |
| Animated backdrop | Seedance, Kling, Veo, Hailuo |

## Install

Open **Extensions → Install extension** in SillyTavern, paste `https://github.com/AceDataCloud/SillyTavernAceMusic` and install. Reload if prompted. Existing ACE Music Scene Player installations can update in place. The extension requires a browser and an accessible task that returns an HTTPS media URL.

## Connect a chat model

The extension adds **Ace Data Cloud** to the host's **Chat Completion Source** list on SillyTavern versions with Custom Provider API v1. The [SillyTavern provider guide](https://docs.sillytavern.app/for-contributors/provider-integrations/) identifies this as the 1.20+ API, available on staging before release. On 1.19.x, follow the manual connection instructions below.

1. Open **API Connections**, select **Chat Completion**, and choose **Ace Data Cloud**.
2. Select or enter an [Ace Data Cloud application key](https://platform.acedata.cloud/console/applications) in the host's provider card and click **Connect**. The host discovers models from `https://api.acedata.cloud/v1/models` and stores your key bound to the API root.
3. Choose a chat model available to your account. The same source supports GPT, Claude, Gemini, DeepSeek, Grok, GLM, Kimi and MiMo chat model IDs. The catalog also contains entries for image generation and embeddings; choose a chat model for a conversation.
4. Send a message through SillyTavern's normal chat composer when ready. Model requests use your application quota. Streaming, tools, images and reasoning depend on the selected model's chat API capabilities. [Ace Data Cloud API documentation](https://docs.acedata.cloud)

**Manual connection for 1.19.x.** In **API Connections → Chat Completion**, choose **Custom (OpenAI-compatible)**, set the API root to `https://api.acedata.cloud/v1`, enter your Ace application key in SillyTavern's key field, and click **Connect**. Select a chat model or enter its exact ID. On installations already using another custom provider, save its Connection Profile first and select the Ace key when switching. Keep the default request headers and prompt processing for a standard connection.

## Set a scene

1. Open a chat and expand **Extensions → Ace Scene Media**. Choose the service that created your task and enter its [Ace Data Cloud](https://platform.acedata.cloud/) application token and task ID.
2. Choose **Load media**. For a soundtrack, select an arrangement, press Play and optionally enable **Loop soundtrack**. For a still or animated backdrop, select a result and choose **Show in this chat**.
3. For example, play a quiet Suno arrangement, switch the service to Nano Banana and load an illustration of the same tavern. The music continues behind the scene. **Clear backdrop** reveals your usual SillyTavern background.
4. To check a pending task, load it again. Changing chats stops playback, removes the temporary backdrop and clears the form.

The browser sends the token and task ID directly to the selected service's task lookup endpoint. It loads media from the HTTPS links returned by the service. Media lookup tokens stay in the current page and clear when you change services or chats. The scene panel only retrieves existing tasks. SillyTavern separately manages the chat provider key and chat history. Links may expire, and image tasks using base64 output need a URL result for playback.

[Support and issues](https://github.com/AceDataCloud/SillyTavernAceMusic/issues)
