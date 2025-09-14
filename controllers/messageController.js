import Message from '../models/Message.js';

import User from '../models/User.js';
import Group from '../models/Group.js';

import cloudinary from '../cloudinaryConfig.js';
import * as Notifications from 'expo-server-sdk';

import { onlineUsers } from '../utils/socket.js';
import { sendExpoPush } from '../utils/push.js';

// Work Imports
import Task from '../models/features/work/task.model.js';
import Poll from '../models/features/work/poll.model.js';
import Idea from '../models/features/work/idea.model.js';
import Note from '../models/features/work/note.model.js';
import Meeting from '../models/features/work/meeting.model.js';

//School Imports 
import Assignment from '../models/features/school/assignment.model.js';
import Quiz from '../models/features/school/quiz.model.js';
import StudyEvent from '../models/features/school/studyEvent.model.js';
import Resource from '../models/features/school/resource.model.js';

// Home Imports
import ShoppingList from "../models/features/home/shoppingList.model.js";
import Budget from '../models/features/home/budget.model.js'
import Chore from '../models/features/home/chore.model.js'
import Event from "../models/features/home/eventCalender.model.js";
import Reminder from "../models/features/home/reminder.model.js";

//Travel Imports

import Location from '../models/features/travel/locationShare.model.js';
import Itinerary from '../models/features/travel/itinerary.model.js';
import TravelDocument from '../models/features/travel/documentVault.model.js';
import TravelChecklist from '../models/features/travel/travelChecklist.model.js';
import Expense from '../models/features/travel/expenseSplit.model.js';

// @desc    Get messages for group
// export const getGroupMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({ group: req.params.groupId })
//       .populate('sender', 'name pic currentStatus mood')
//       .sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const expo = new Notifications.Expo();

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Find all messages for the group
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    // 2. Find all tasks for the group
    const poll = await Poll.find({ groupId })
      .populate('sender', 'name pic currentStatus mood');

    const location = await Location.find({ groupId });


    const resources = await Resource.find({ groupId })
    // 3. Send both in the response
    res.json({
      messages,
      poll,
      resources,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSchoolGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Find and clean messages
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const cleanedMessages = messages.map(msg => {
      const cleaned = {
        _id: msg._id,
        sender: msg.sender,
        group: msg.group,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isPrivate: msg.isPrivate
      };

      if (msg.text) {
        cleaned.text = msg.text;
      }

      if (msg.audio && msg.audio.url) {
        cleaned.audio = {
          url: msg.audio.url,
          mimeType: msg.audio.mimeType || 'audio/mpeg',
          duration: msg.audio.duration || null
        };
      }

      return cleaned;
    });

    // 2. Find all assignments, quizzes, events, and resources
    const assignments = await Assignment.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    const quizzes = await Quiz.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    const events = await StudyEvent.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ date: 1 });

    const resources = await Resource.find({ groupId })
      .populate('createdBy', 'name role');

    // 3. Send everything in the response
    res.json({
      messages: cleanedMessages,
      assignments,
      quizzes,
      events,
      resources
    });

  } catch (error) {
    console.error('Error fetching school group messages:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getHomeGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Find and clean messages
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const cleanedMessages = messages.map(msg => {
      const cleaned = {
        _id: msg._id,
        sender: msg.sender,
        group: msg.group,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isPrivate: msg.isPrivate
      };

      if (msg.text) {
        cleaned.text = msg.text;
      }

      if (msg.audio && msg.audio.url) {
        cleaned.audio = {
          url: msg.audio.url,
          mimeType: msg.audio.mimeType || 'audio/mpeg',
          duration: msg.audio.duration || null
        };
      }

      return cleaned;
    });

    // 2. Fetch and populate other home group data
    const shoppingLists = await ShoppingList.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    const budgets = await Budget.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    const chores = await Chore.find({ groupId })
      .populate('assignedTo', 'name pic')
      .sort({ createdAt: -1 });

    const events = await Event.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ date: 1 });

    const reminders = await Reminder.find({ groupId })
      .populate('createdBy', 'name role')
      .sort({ reminderTime: 1 });

    // 3. Return all in response
    res.json({
      messages: cleanedMessages,
      shoppingLists,
      budgets,
      chores,
      events,
      reminders
    });
  } catch (error) {
    console.error('Error fetching home group messages:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTravelGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Find all messages for the group
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    // Clean messages
    const cleanedMessages = messages.map(msg => {
      const cleaned = {
        _id: msg._id,
        sender: msg.sender,
        group: msg.group,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isPrivate: msg.isPrivate
      };

      if (msg.text) {
        cleaned.text = msg.text;
      }

      if (msg.audio && msg.audio.url) {
        cleaned.audio = {
          url: msg.audio.url,
          mimeType: msg.audio.mimeType || 'audio/mpeg',
          duration: msg.audio.duration || null
        };
      }

      return cleaned;
    });

    // 2. Fetch other travel group data
    const locations = await Location.find({ groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const itineraries = await Itinerary.find({ groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const travelDocuments = await TravelDocument.find({ groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const checklists = await TravelChecklist.find({ groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    const expenses = await Expense.find({ groupId })
      .populate('sender', 'name pic currentStatus mood')
      .populate('paidBy', 'name pic currentStatus mood')
      .populate('sharedWith', 'name pic currentStatus mood')
      .populate('paidByUsers', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    // 3. Send in the response
    res.json({
      messages: cleanedMessages,
      locations,
      itineraries,
      travelDocuments,
      checklists,
      expenses
    });
  } catch (error) {
    console.error('Error fetching travel group messages:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getWorkGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Find all messages for the group
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name pic currentStatus mood')
      .sort({ createdAt: 1 });

    // Clean messages: remove null text/audio
    const cleanedMessages = messages.map(msg => {
      const cleaned = {
        _id: msg._id,
        sender: msg.sender,
        group: msg.group,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isPrivate: msg.isPrivate
      };

      if (msg.text) {
        cleaned.text = msg.text;
      }

      if (msg.audio && msg.audio.url) {
        cleaned.audio = {
          url: msg.audio.url,
          mimeType: msg.audio.mimeType || 'audio/mpeg',
          duration: msg.audio.duration || null
        };
      }

      return cleaned;
    });

    // 2. Other types (poll, note, meeting, idea, task)
    const poll = await Poll.find({ groupId }).populate('sender', 'name pic currentStatus mood');
    const note = await Note.find({ groupId }).populate('sender', 'name pic currentStatus mood');
    const meeting = await Meeting.find({ groupId }).populate('sender', 'name pic currentStatus mood');
    const idea = await Idea.find({ groupId }).populate('sender', 'name pic currentStatus mood');
    const task = await Task.find({ groupId }).populate('sender', 'name pic currentStatus mood');

    res.json({
      messages: cleanedMessages,
      poll,
      idea,
      task,
      note,
      meeting
    });

  } catch (error) {
    console.error('Error fetching work group messages:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new message
// export const createMessage = async (req, res) => {
//   try {
//     const { groupId, text } = req.body;

//     const message = await Message.create({
//       sender: req.user._id,
//       group: groupId,
//       text,
//     });

//     const populatedMessage = await Message.populate(message, {
//       path: 'sender',
//       select: 'name pic currentStatus mood'
//     });

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createMessage = async (req, res) => {
//   try {
//     const { groupId, text, senderId } = req.body;

//     if (!senderId || !groupId || !text) {
//       return res.status(400).json({ message: 'senderId, groupId, and text are required' });
//     }

//     const message = await Message.create({
//       sender: senderId,
//       group: groupId,
//       text,
//     });

//     const populatedMessage = await Message.populate(message, {
//       path: 'sender',
//       select: 'name pic currentStatus mood'
//     });

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const createMessage = async (req, res) => {
  try {
    const { groupId, senderId, text, duration } = req.body;

    const hasAudio = req.files?.audio;
    const hasText = text && text.trim() !== '';

    if (!senderId || !groupId) {
      return res.status(400).json({ message: 'senderId and groupId are required' });
    }

    if ((hasText && hasAudio) || (!hasText && !hasAudio)) {
      return res.status(400).json({ message: 'Provide either a text or audio message, not both or neither.' });
    }

    const messageData = {
      sender: senderId,
      group: groupId,
      isPrivate: false,
    };

    if (hasText) {
      messageData.text = text;
    }

    if (hasAudio) {
      const audioFile = req.files.audio;

      const uploadResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
        resource_type: 'video',
        folder: 'chat-audios'
      });

      messageData.audio = {
        url: uploadResult.secure_url,
        duration: duration ? Number(duration) : undefined,
        mimeType: audioFile.mimetype
      };
    }

    const message = await Message.create(messageData);

    const populatedMessage = await Message.populate(message, {
      path: 'sender',
      select: 'name pic currentStatus mood'
    });

    // Emit to group members via socket
    const io = req.app.get('io');
    if (io) {
      console.log('Emitting groupMessage to group:', groupId);
      io.to(groupId.toString()).emit('groupMessage', populatedMessage);
    }

    // 2) Push notifications: notify offline group members (exclude sender)
    try {
      const group = await Group.findById(groupId).populate('members', 'pushToken name _id');
      if (group) {
        const senderIdStr = senderId ? senderId.toString() : (req.user?._id?.toString && req.user._id.toString());
        const pushBody = hasText ? populatedMessage.text : '🎵 Audio message';
        for (const member of group.members) {
          const memberIdStr = member._id.toString();
          if (memberIdStr === senderIdStr) continue; // don't notify sender

          // Check if member is offline
          const sockets = onlineUsers.get(memberIdStr);
          if (!sockets || sockets.size === 0) {
            if (member.pushToken) {
              await sendExpoPush(member.pushToken, {
                title: `${group.name}`,
                body: pushBody,
                data: { type: 'group_message', groupId, messageId: message._id }
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('Error sending group push notifications:', err);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Send private message


// export const sendPrivateMessage = async (req, res) => {
//   try {
//     const { recipientId, text } = req.body;

//     // Validate recipient exists
//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({ message: 'Recipient not found' });
//     }

//     const message = await Message.create({
//       sender: req.user._id,
//       recipient: recipientId,
//       text,
//       isPrivate: true // This will make group field optional
//     });

//     const populatedMsg = await Message.populate(message, {
//       path: 'sender recipient',
//       select: 'name pic'
//     });

//     res.status(201).json(populatedMsg);
//   } catch (error) {
//     console.error('Error sending private message:', error);
//     res.status(500).json({
//       message: error.message,
//       details: error.errors
//     });
//   }
// };



// Send private Message Works Perfetly ********************************
// export const sendPrivateMessage = async (req, res) => {
//   try {
//     const { recipientId, text, duration } = req.body;

//     // Validate recipientId
//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({ message: 'Recipient not found' });
//     }

//     // Validate: Only one of text or audio should be present
//     const hasText = text && text.trim() !== '';
//     const hasAudio = req.files?.audio;

//     if ((hasText && hasAudio) || (!hasText && !hasAudio)) {
//       return res.status(400).json({
//         message: 'Provide either a text or audio message, not both or neither.'
//       });
//     }

//     const messageData = {
//       sender: req.user._id,
//       recipient: recipientId,
//       isPrivate: true,
//     };

//     if (hasText) {
//       messageData.text = text;
//     }

//     if (hasAudio) {
//       const audioFile = req.files.audio;

//       const uploadResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
//         resource_type: 'video',
//         folder: 'chat-audios'
//       });

//       messageData.audio = {
//         url: uploadResult.secure_url,
//         duration: duration ? Number(duration) : undefined,
//         mimeType: audioFile.mimetype
//       };
//     }
//     // console.log(messageData.audio.url)

//     const message = await Message.create(messageData);

//     console.log('Message:', message)

//     const populatedMsg = await Message.populate(message, {
//       path: 'sender recipient',
//       select: 'name pic'
//     });

//     res.status(201).json(populatedMsg);
//   } catch (error) {
//     console.error('Error sending private message:', error);
//     res.status(500).json({ message: error.message });
//   }
// };



// Send Private Message with Push Notifications
export const sendPrivateMessage = async (req, res) => {
  try {
    const { recipientId, text, duration } = req.body;
    const io = req.app.get('io');

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    // Check if it's an audio message or text message
    const hasAudio = req.files?.audio;
    const hasText = text && text.trim() !== '';

    if ((hasText && hasAudio) || (!hasText && !hasAudio)) {
      return res.status(400).json({ message: 'Provide either a text or audio message, not both or neither.' });
    }

    const messageData = {
      sender: req.user._id,
      recipient: recipientId,
      isPrivate: true,
    };

    if (hasText) {
      messageData.text = text;
    }

    if (hasAudio) {
      const audioFile = req.files.audio;

      const uploadResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
        resource_type: 'video',
        folder: 'chat-audios'
      });

      messageData.audio = {
        url: uploadResult.secure_url,
        duration: duration ? Number(duration) : undefined,
        mimeType: audioFile.mimetype
      };
    }

    const message = await Message.create(messageData);

    const populatedMsg = await Message.populate(message, {
      path: 'sender recipient',
      select: 'name pic'
    });

    // 1) In-app realtime
    console.log('Emitting privateMessage to recipient:', recipientId.toString());
    console.log('Message data:', populatedMsg);
    io.to(recipientId.toString()).emit('privateMessage', populatedMsg);

    // 2) Push if recipient is offline
    const sockets = onlineUsers.get(recipientId.toString());
    if (!sockets || sockets.size === 0) {
      if (recipient.pushToken) {
        const pushBody = hasText ? populatedMsg.text : '🎵 Audio message';
        await sendExpoPush(recipient.pushToken, {
          title: `${populatedMsg.sender.name}`,
          body: pushBody,
          data: { type: 'chat_message', messageId: message._id }
        });
      }
    }

    res.status(201).json(populatedMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};




// Get private chat history
export const getPrivateChat = async (req, res) => {
  try {
    const messages = await Message.find({
      isPrivate: true,
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name pic');

    const cleanedMessages = messages.map(msg => {
      const message = {
        _id: msg._id,
        sender: msg.sender,
        recipient: msg.recipient,
        isPrivate: msg.isPrivate,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isSentByMe: msg.sender._id.toString() === req.user._id.toString()
      };

      if (msg.text) {
        message.text = msg.text;
      }

      if (msg.audio && msg.audio.url) {
        message.audio = {
          url: msg.audio.url,
          mimeType: msg.audio.mimeType || 'audio/mpeg',
          duration: msg.audio.duration || null
        };
      }

      // Add formatted time
      message.time = new Date(msg.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      return message;
    });

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        messages: cleanedMessages
      }
    });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({ message: error.message });
  }
};
