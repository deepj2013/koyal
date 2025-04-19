export enum SocketRoutes {
  ProcessAudio = "start-audio-processing",
  ProcessAudioCompleted = "audio-processing-result",
  ProcessAudioError = "audio-processing-error",

  ProcessScene = "lyrics-edit-processing",
  ProcessSceneCompleted = "lyrics-processing-result",
  ProcessSceneError = "lyrics-processing-error",

  ProcessAvatar = "start-avtar-processing",
  ProcessAvatarCompleted = "avatar-character-processing-result",
  ProcessAvatarError = "avatar-character-processing-error",
}
