const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;

        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 1024,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        });

        return res.status(200).json({
            message: response.content[0].text
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}