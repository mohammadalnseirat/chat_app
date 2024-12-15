export const createChatSlice = (set, get) => ({
  selectChatType: undefined,
  selectChatData: undefined,
  selectedChatMessages: [], // to fetch an existing messages
  setSelectChatType: (selectChatType) => set({ selectChatType }),
  setSelectChatData: (selectChatData) => set({ selectChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectChatData: undefined,
      selectChatType: undefined,
      selectedChatMessages: [],
    }), // when close reset the selected chat data and type and remove the messages.
});

// select chat data contain the actual data like: firstName, lastName, image for the selectchatType...
// and for the channel.
