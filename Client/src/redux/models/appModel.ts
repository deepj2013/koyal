export interface AppModel {
  isEnglish: boolean | null;
  characterName: string;
  loraPath: string | null;
  audioFileUrl: string | null;
  styleImagesUrl: string | null;
  protoPromptsUrl: string | null;
  lyricsJsonUrl: string | null;
  imageFolderUrl: string | null;
  scenesJson: any;
  replacementWord: string | null;
  isCharchaChosen: null | boolean;
  characterFolderPath: string | null;
}
