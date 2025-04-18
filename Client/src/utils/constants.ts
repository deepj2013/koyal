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

export const CharacterStylesList = [
  CharacterStyles.REALISTIC,
  CharacterStyles.ANIMATED,
  CharacterStyles.SKETCH,
];

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
  CREATE_STORY = "create-story",
  CREATE_PROMPT = "create-prompts",
  EDIT_PROMPT = "edit-prompts",
  EDIT_STORY = "edit-story",
  EDIT_CHARACTER = "edit-character",
}

export enum ReplacementWords {
  MAN = "man",
  WOMAN = "woman",
  PERSON = "person",
}

export const styles = [
  { id: "realistic", label: CharacterStyles.REALISTIC },
  { id: "animated", label: CharacterStyles.ANIMATED },
  { id: "sketch", label: CharacterStyles.SKETCH },
];

export const StyleColors = {
  realistic: "bg-[#B2EEFF]",
  animated: "bg-[#FFB2B2]",
  sketch: "bg-[#B2FFB2]",
};

export const collectionListHeaders = [
  { id: "preview", label: "Preview" },
  { id: "title", label: "Title" },
  { id: "theme", label: "Theme" },
  { id: "character", label: "Character" },
  { id: "style", label: "Style" },
  { id: "orientation", label: "Orientation" },
  { id: "actions", label: "Actions" },
  { id: "auto", label: "Auto Generate" },
  { id: "manual", label: "Manual Generate" },
];
