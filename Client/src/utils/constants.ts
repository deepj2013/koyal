export const INSTAGRAM_URL = "https://www.instagram.com/koyal.ai";

export enum Stages {
  VERIFICATION = "verification",
  IDENTIFICATION = "identification",
  CALIBRATION = "calibration",
  ACTION_RECORD = "actionRecord",
  DEFAULT = "default",
}

export enum CharacterStyles {
  REALISTIC = "Realistic",
  ANIMATED = "Animated",
  SKETCH = "Sketch",
}

export enum VideoOrientationStyles {
  PORTRAIT = "portrait",
  SQUARE = "square",
  LANDSCAPE = "landscape",
}

export const ConfirmButtonTextMap = {
  [Stages.VERIFICATION]: "Begin Face Verification",
  [Stages.IDENTIFICATION]: "Continue",
  [Stages.CALIBRATION]: "Start Calibration",
  [Stages.ACTION_RECORD]: "Finalize the Character",
};

export enum AvatarProcessModes {
  CREATE = "create",
  UPSCALE = "upscale",
}

export enum EditStoryModes {
  CREATE_PROMPT = "create-prompts",
  EDIT_STORY = "edit-story",
  EDIT_CHARACTER = "edit-character",
}
