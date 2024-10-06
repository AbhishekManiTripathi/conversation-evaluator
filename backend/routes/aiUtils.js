// aiUtils.js
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Loaded from .env

// Utility function to create OpenAI prompt based on metrics
export const createOpenAIPrompt = (queryLog, metrics) => {
    let prompt = `Evaluate the following conversation and context, returning the results in JSON format. 
    Each metric should have a score between 0 and 10 (where 0 means not at all and 10 means perfect) along with a brief description of the evaluation. 
    Use the keys: 
    "Question Clarity", "Answer Relevance", "Grammar and Fluency", "Conciseness", and "Contextual Understanding". 
    If a metric is not evaluated, its value should be null or an empty string.\n\n`;

    // Include conversation history
    if (queryLog.conversationHistory && queryLog.conversationHistory.length > 0) {
        prompt += `Conversation History:\n`;
        queryLog.conversationHistory.forEach((exchange, index) => {
            prompt += `${index + 1}. User: ${exchange.user}\n   Bot: ${exchange.bot}\n`;
        });
        prompt += '\n';
    }

    // Include the question and the bot's answer
    prompt += `User Question: ${queryLog.userQuestion}\n`;
    prompt += `Bot Answer: ${queryLog.BotAnswer}\n\n`;

    // Include context
    prompt += `Context:\nLocation: ${queryLog.context.location}\nLanguage: ${queryLog.context.userLanguage}\nSession ID: ${queryLog.context.sessionID}\nTimestamp: ${queryLog.context.timestamp}\n\n`;

    // Add prompts for the selected metrics
    prompt += `Evaluate the following metrics:\n`;
    metrics.forEach((metric) => {
        prompt += `- ${metric}\n`;
    });
    prompt += `\nReturn the results as a JSON object containing a score and description for each metric.`;

    return prompt;
};

// Function to evaluate the query log using OpenAI
export const evaluateWithOpenAI = async (queryLog, metrics) => {
    
    const prompt = createOpenAIPrompt(queryLog, metrics);
    console.log(prompt);

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo-0125', // Specify the model you want to use
                messages: [
                    { role: 'system', content: 'You are an expert conversation evaluator.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0, // Adjust the temperature as needed
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Assuming the response returns a valid JSON string
        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error while communicating with OpenAI:', error);
        throw new Error('OpenAI evaluation failed');
    }
};
