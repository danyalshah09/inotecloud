const NoteReducer = (state, action) => {
  switch (action.type) {
    case "GET_ALL_NOTES":
      return {
        ...state,
        notes: action.payload,
      };
    case "ADD_NOTE":
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
      };
    default:
      return state;
  }
};

export default NoteReducer; 