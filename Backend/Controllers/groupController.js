import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    console.log(req.body);

    const creatorId = req.body.userId;
    const { name, participants } = req.body;

    const newGroup = new Group({
      name,
      creatorId,
      participants,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ msg: "Server error creating group." });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(groupId);

    const group = await Group.findById(groupId);
    res.json(group);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ msg: "Server error fetching groups." });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ creatorId: userId });
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ msg: "Server error fetching groups." });
  }
};

export const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newMembers } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }

    group.participants = [...new Set([...group.participants, ...newMembers])];

    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error adding members to group:", error);
    res.status(500).json({ msg: "Server error adding members to group." });
  }
};
