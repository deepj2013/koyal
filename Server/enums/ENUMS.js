export const roleEnum = {
  USER: 'user',
  ADMIN: 'admin'
}

export const taskTypeEnum = {
  GROUP: 'Group',
  INDIVIDUAL: 'Individual'
}
export const taskStatusENUM = {
  PENDING: 'Pending',
  COMPLETED: 'Completed'
}

export const taskLogStatusENUM = {
  PROGRESS: 'Progress',
  COMPLETED: 'Completed'
}

export const visualStyleEnum = {
  REALISTIC: 'Realistic',
  SKETCH: 'Sketch',
  ANIMATED: 'Animated'
}

export const OrientationEnum = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
  SQUARE: 'square'
}

export const audioTypeEnum = {
  MUSIC: 'Music',
  PODCAST: 'Podcast',
  VOICEOVER: 'Voiceover',
}

export const userStageEnum = {
  UPLOAD_AUDIO: 'upload audio',
  REVIEW_TRANSCRIPT: 'review transcript',
  CHOOSE_CHARACTER: 'chosse character',
  SELECT_STYLE: 'select style',
  EDIT_SCENES: 'edit scene',
  FINAL_VIDEO: 'final video'
}

export const userTaskLogNameEnum = {
  UPLOAD_AUDIO: 'upload audio',
  REVIEW_TRANSCRIPT: 'review transcript',
  CHOOSE_CHARACTER: 'choose character',
  AUDIO_PROCESSING: "audio-processing"
}

export const editStoryModes = {
  CREATE_PROMPT: "create-prompts",
  EDIT_PROMPT: "edit-prompts",
  EDIT_STORY: "edit-story",
  EDIT_CHARACTER: "edit-character",
  CREATE_STORY: "create-story"
}

export const AvatarProcessModes = {
  CREATE: "create",
  UPSCALE: "upscale",
}

export const ReplacementWords = {
  MAN: "man",
  WOMAN: "woman",
  PERSON: "person",
}


export const audioProcessingEnum = {
  AUDIO_PROCESSING_START: "audio-processing-start",
  AUDIO_PROCESSING_END: "audio-processing-end",
  AUDIO_PROCESSING_RESULT: "audio-processing-result",

  EMOTION_SUBMIT_PROCESSING_START: "emotion-processing",
  EMOTION_SUBMIT_PROCESSING_COMPLETED: "emotion-processing",
  EMOTION_RESULT_PROCESSING_START: "emotion-result-processing",
  EMOTION_RESULT_PROCESSING_COMPLETED: "emotion-result-processing",

  TRANSCRIBER_SUBMIT_PROCESSING_START: "transcriber-processing",
  TRANSCRIBER_SUBMIT_PROCESSING_COMPLETED: "transcriber-processing",
  TRANSCRIBER_RESULT_PROCESSING_START: "transcriber-result-processing",
  TRANSCRIBER_RESULT_PROCESSING_COMPLETED: "transcriber-result-processing",

  SCENE_SUBMIT_PROCESSING_START: "scene-submit-processing",
  SCENE_SUBMIT_PROCESSING_COMPLETED: "scene-submit-processing",

  SCENE_RESULT_PROCESSING_START: "scene-result-processing",
  SCENE_RESULT_PROCESSING_COMPLETED: "scene-result-processing",

  AUDIO_PROCESSING_ERROR: "audio-processing-error"
}

export const processingStatus = {
  STARTED: "started",
  COMPLETED: "completed",
}

export const lyricsProcessENUM = Object.freeze({
  START: 'lyrics-processing-start',
  END: 'lyrics-processing-end',
  STORY_SUBMIT: 'story-submit',
  STORY_RESULT: 'story-result',
  LYRICS_PROCESSING_RESULT: 'lyrics-processing-result',
  LYRICS_PROCESSING_ERROR: 'lyrics-processing-error',
  VALIDATION_ERROR: 'validation-error',
})

export const themeCharacterEnum = Object.freeze({
  START: 'theme-character-processing-start',
  END: 'theme-character-processing-end',
  THEME_CHARACTER_PROCESSING_RESULT: 'theme-character-processing-result',
  THEME_CHARACTER_PROCESSING_ERROR: 'theme-character-processing-error',
  VALIDATION_ERROR: 'validation-error',
  THEME_CHARACTER_PROCESSING:'theme-character-processing',
})