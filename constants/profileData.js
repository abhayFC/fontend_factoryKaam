export const images = {
  profilePicture: require("@/assets/images/user2.jpg"),
  logo: require("@/assets/images/logo2.png"),
};

export const profileData = {
  name: "John Doe",
  profilePicture: "user1",
  location: "Maharashtra, India",
  connections: 283,
  followers: 321,
  following: 22,
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  experiences: {
    heading: "Experience",
    editHeading: "Edit Experience",
    items: [
      {
        title: "CNC Machining",
        company: "AirBnb",
        date: "Jul 2024-Present",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        isRemote: true,
      },
      {
        title: "Weaving",
        company: "Figma Inc",
        date: "Jul 2024-Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        isRemote: true,
      },
      {
        title: "Handloom",
        company: "Figma Inc",
        date: "Jul 2024-Present",
        description:
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        isRemote: true,
      },
    ],
  },
  education: {
    heading: "Education",
    editHeading: "Edit Education",
    items: [
      {
        title: "Skill India Center",
        company: "Diploma",
        date: "Jul 2024-Present",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        isRemote: true,
      },
    ],
  },
  skills: ["CNC Machining", "Weaving", "Handloom"],
};

export const communityData = {
  name: "Weaving",
  location: "Maharashtra, India",
  members: 283,
  posts: 321,
  impressions: 21,
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};
