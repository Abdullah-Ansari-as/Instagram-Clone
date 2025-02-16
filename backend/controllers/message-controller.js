import { Conversation } from "../models/conversation-model.js";
import { Message } from "../models/message-model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// This controller is For "Chatting"
const sendMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;
		const { textMessage: message } = req.body;
		// console.log(message)
		if (!message) {
			return res.status(404).json({
				messageee: "message is required",
				success: false
			})
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }
		})

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId]
			})
		};

		const newMessage = await Message.create({
			senderId,
			receiverId,
			message
		})

		if (newMessage) {
			conversation.messages.push(newMessage._id)
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		// implement socket io for real data transfer
		const receiverSocketId = getReceiverSocketId(receiverId)
		if (receiverSocketId) {
			io.to(receiverSocketId).emit('newMessage', newMessage)
		}


		return res.status(202).json({
			success: true,
			newMessage
		})

	} catch (error) {
		return res.status(500).json({ message: "Failed to send message", success: false })
	}
}

const getMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }
		}).populate('messages')
		// console.log(conversation)

		if (!conversation) return res.status(200).json({ success: true, message: [] });

		return res.status(200).json({
			success: true,
			messages: conversation?.messages
		})

	} catch (error) {
		return res.status(500).json({ message: "Failed to get message", success: false })
	}
}

export {
	sendMessage,
	getMessage
}