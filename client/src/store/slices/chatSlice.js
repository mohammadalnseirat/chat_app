export const createChatSlice = (set, get) => ({
  selectChatType: undefined,
  selectChatData: undefined,
  selectedChatMessages: [], // to fetch an existing messages
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownLoadProgress: 0,
  channels: [],

  // ! Functions to set the state:
  setSelectChatType: (selectChatType) => set({ selectChatType }),
  setSelectChatData: (selectChatData) => set({ selectChatData }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownLoading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownLoadProgress) =>
    set({ fileDownLoadProgress }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setChannels: (channels) => set({ channels }), // to fetch all channels.
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  closeChat: () =>
    set({
      selectChatData: undefined,
      selectChatType: undefined,
      selectedChatMessages: [],
    }), // when close reset the selected chat data and type and remove the messages.
  //! Function to add messages to the chat:
  addMessages: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectChatType = get().selectChatType;

    //? set the selected chat messages:
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectChatType === "channel" ? message.sender : message.sender._id,
        },
      ],
    });
  },
});

// select chat data contain the actual data like: firstName, lastName, image for the selectchatType...
// and for the channel.

// in the function to add messages if the select chat type is channel then we will send the entire recipient object.
// but if the type was contact we will send the id of the recipient to know which contact user we will send/receive the message to.
