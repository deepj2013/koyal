export const staticExcelFileUrl =
  "https://s3.ap-south-1.amazonaws.com/koyal.ai/Koyal-demo-assets/template.xlsx";

export const staticAudios = {
  success: true,
  message: "All audio names fetched successfully",
  data: [
    {
      _id: "67fe2518ee03e85afec4222d",
      groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
      fileName: "The-Night-We-Met (1).mp3",
      audioUrl:
        "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/The-Night-We-Met%20(1).mp3",
    },
    {
      _id: "67fe2518ee03e85afec4222e",
      groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
      fileName: "apt.mp3",
      audioUrl:
        "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/apt.mp3",
    },
  ],
};

export const staticAudioList = {
  success: true,
  message: "Bulk audio details fetched successfully",
  data: [
    {
      _id: "67fe2518ee03e85afec42230",
      taskLogs: {
        _id: "67fe25baee03e85afec42238",
        taskId: "67fe2518ee03e85afec42230",
        groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
        audioDetails: {
          audioId: "67fe2518ee03e85afec4222d",
          audioUrl:
            "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/The-Night-We-Met%20(1).mp3",
          originalFileName: "The-Night-We-Met (1).mp3",
          collectionName: "My-Collection-50",
          theme: "In the Forest",
          style: "Realistic",
          orientation: "landscape",
          character: "An old indian Man",
          lipSync: true,
        },
      },
    },
    {
      _id: "67fe2518ee03e85afec42230",
      taskLogs: {
        _id: "67fe25baee03e85afec42239",
        taskId: "67fe2518ee03e85afec42230",
        groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
        audioDetails: {
          audioId: "67fe2518ee03e85afec4222e",
          audioUrl:
            "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/apt.mp3",
          originalFileName: "apt.mp3",
          collectionName: "My-Collection-50",
          theme: "In the Hotel",
          style: "Animated",
          orientation: "portrait",
          character: "A young man",
          lipSync: false,
        },
      },
    },
  ],
};

export const staticAudioListAfterAdd = {
  success: true,
  message: "Bulk audio details fetched successfully",
  data: [
    {
      _id: "67fe2518ee03e85afec42230",
      taskLogs: {
        _id: "67fe25baee03e85afec42238",
        taskId: "67fe2518ee03e85afec42230",
        groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
        audioDetails: {
          audioId: "67fe2518ee03e85afec4222d",
          audioUrl:
            "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/The-Night-We-Met%20(1).mp3",
          originalFileName: "The-Night-We-Met (1).mp3",
          collectionName: "My-Collection-50",
          theme: "In the Forest",
          style: "Sketch",
          orientation: "landscape",
          character: "An old indian Man",
          lipSync: true,
        },
      },
    },
    {
      _id: "67fe2518ee03e85afec42230",
      taskLogs: {
        _id: "67fe25baee03e85afec42239",
        taskId: "67fe2518ee03e85afec42230",
        groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
        audioDetails: {
          audioId: "67fe2518ee03e85afec4222e",
          audioUrl:
            "https://s3.ap-south-1.amazonaws.com/koyal.ai/test%40gmail.com/collections/apt.mp3",
          originalFileName: "apt.mp3",
          collectionName: "My-Collection-50",
          theme: "In the Hotel",
          style: "Animated",
          orientation: "portrait",
          character: "A young man",
          lipSync: false,
        },
      },
    },
    {
      _id: "67fe2518ee03e85afec42230",
      taskLogs: {
        _id: "67fe28f2ee03e85afec42261",
        taskId: "67fe2518ee03e85afec42230",
        groupId: "group-6ea2cf82-6042-456f-a1b2-522e149aab83",
        audioDetails: {
          originalFileName: "The-Night-We-Met (1).mp3",
          collectionName: "My-Collection-50",
          theme: "New Theme",
          style: "Animated",
          orientation: "portrait",
          character: "New Character",
          lipSync: false,
        },
      },
    },
  ],
};
