import ChannelMessage from "../models/ChannelMessage.model.js";

class ChannelMessageRepository {
    static async create({ channel_id, user_id, content }) {
        const newMessage = new ChannelMessage({
            channel_id,
            user_id,
            content,
            created_at: new Date()
        });

        await newMessage.save();
        return newMessage;
    }

    static async getAllByChannel(channel_id) {
        return await ChannelMessage
            .find({ channel_id })
            .populate("user_id", "name email")
            .sort({ created_at: 1 });
    }
}

export default ChannelMessageRepository;
